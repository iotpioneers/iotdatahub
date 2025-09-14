import type {
  IProtocolHandler,
  IDeviceManager,
  DeviceSocket,
  ParsedMessage,
} from "./types";
import { PROTOCOL } from "./types";
import type WebSocketManager from "./websocketManager";
import type DeviceCacheManager from "./deviceCacheManager";
import SimpleMessage from "./message";
import { parseHardwareCommand, parseDeviceInfo } from "./commandParser";
import { storeDeviceInfo, storeHardwareData } from "./dataStorage";
import logger from "./logger";

class SimpleProtocolHandler implements IProtocolHandler {
  private readonly deviceManager: IDeviceManager;
  private readonly wsManager: WebSocketManager;
  private readonly deviceCache: DeviceCacheManager;

  constructor(
    deviceManager: IDeviceManager,
    wsManager: WebSocketManager,
    deviceCache: DeviceCacheManager,
  ) {
    this.deviceManager = deviceManager;
    this.wsManager = wsManager;
    this.deviceCache = deviceCache;
  }

  async handleMessage(
    socket: DeviceSocket,
    message: ParsedMessage,
    deviceToken: string | null,
  ): Promise<void> {
    try {
      logger.debug("Message received", {
        type: message.type,
        id: message.id,
        token: deviceToken ? this.deviceManager.maskToken(deviceToken) : null,
      });

      switch (message.type) {
        case PROTOCOL.CMD_HW_LOGIN:
          await this.handleLogin(socket, message);
          break;
        case PROTOCOL.CMD_INTERNAL:
          await this.handleDeviceInfoMessage(socket, message, deviceToken);
          break;
        case PROTOCOL.CMD_HARDWARE:
          await this.handleHardwareMessage(socket, message, deviceToken);
          break;
        case PROTOCOL.CMD_HARDWARE_SYNC:
          this.sendSuccessResponse(
            socket,
            message.id,
            "Hardware sync acknowledged",
          );
          break;
        case PROTOCOL.CMD_PING:
          this.sendSuccessResponse(socket, message.id, "Pong");
          break;
        default:
          this.sendSuccessResponse(
            socket,
            message.id,
            `Unknown message type ${message.type} handled`,
          );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error("Message handling error", { error: errorMessage });
      this.sendSuccessResponse(
        socket,
        message.id,
        `Error handled: ${errorMessage}`,
      );
    }
  }

  private async handleHardwareMessage(
    socket: DeviceSocket,
    message: ParsedMessage,
    deviceToken: string | null,
  ): Promise<void> {
    try {
      const parsedCommand = parseHardwareCommand(message.body);

      if (parsedCommand && deviceToken) {
        logger.info("Hardware command parsed", {
          token: this.deviceManager.maskToken(deviceToken),
          command: parsedCommand,
        });

        const isCmd20 =
          message.body.toString().includes("CMD:20") ||
          (parsedCommand.type === "VIRTUAL_WRITE" && parsedCommand.pin === 20);

        // INSTANT WebSocket broadcast using cache (NO DATABASE DELAYS!)
        this.wsManager.broadcastHardwareUpdate(
          deviceToken,
          parsedCommand.pin,
          parsedCommand.value!,
          parsedCommand.type,
          isCmd20, // Pass CMD:20 flag for priority handling
        );

        this.deviceCache.updateDeviceInfo(deviceToken, {
          status: "ONLINE",
          lastPing: new Date(),
          lastActivity: new Date(),
        });

        this.wsManager.broadcastDeviceStatus(deviceToken, "ONLINE", new Date());

        // Store virtual pin data in device manager (for protocol compatibility)
        if (parsedCommand.type === "VIRTUAL_WRITE") {
          const device = this.deviceManager.getDevice(deviceToken);
          if (device) {
            device.virtualPins.set(parsedCommand.pin.toString(), {
              value: parsedCommand.value!,
              timestamp: Date.now(),
            });
          }

          if (isCmd20) {
            // Immediate database update for CMD:20
            storeHardwareData(
              deviceToken,
              parsedCommand.pin,
              parsedCommand.value!,
            );
          } else {
            // Legacy database storage (will be handled by cache background process)
            storeHardwareData(
              deviceToken,
              parsedCommand.pin,
              parsedCommand.value!,
            ).catch((error) => {
              logger.warn("Background database storage failed", { error });
            });
          }

          this.sendSuccessResponse(
            socket,
            message.id,
            `VirtualWrite(${parsedCommand.pin}=${parsedCommand.value}) executed${isCmd20 ? " [CMD:20-PRIORITY]" : ""}`,
          );
        } else {
          this.sendSuccessResponse(
            socket,
            message.id,
            `${parsedCommand.type} executed`,
          );
        }
      } else {
        this.sendSuccessResponse(
          socket,
          message.id,
          "Hardware command processed",
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error("Hardware message handling error", { error: errorMessage });
      this.sendSuccessResponse(
        socket,
        message.id,
        "Hardware command processed (with errors)",
      );
    }
  }

  private async handleDeviceInfoMessage(
    socket: DeviceSocket,
    message: ParsedMessage,
    deviceToken: string | null,
  ): Promise<void> {
    const clientIP = socket.remoteAddress?.replace("::ffff:", "") || "unknown";

    try {
      const deviceInfo = parseDeviceInfo(message.body);

      if (Object.keys(deviceInfo).length > 0 && deviceToken) {
        // Update cache immediately for instant status updates
        this.deviceCache.updateDeviceInfo(deviceToken, {
          status: "ONLINE",
          lastPing: new Date(),
          metadata: {
            mcuVersion: deviceInfo.mcu,
            firmwareType: deviceInfo.firmware,
            buildInfo: deviceInfo.build,
            iotVersion: deviceInfo.version,
            heartbeat: deviceInfo.heartbeat
              ? Number.parseInt(deviceInfo.heartbeat, 10)
              : null,
            bufferSize: deviceInfo.buffer
              ? Number.parseInt(deviceInfo.buffer, 10)
              : null,
            template: deviceInfo.template,
            lastInfoUpdate: new Date().toISOString(),
            connectionCount: 1,
            rawDeviceInfo: deviceInfo,
          },
        });

        // Legacy database storage (background, non-blocking)
        storeDeviceInfo(deviceToken, deviceInfo, clientIP).catch((error) => {
          logger.warn("Background device info storage failed", { error });
        });

        // Broadcast device status update via WebSocket (instant)
        this.wsManager.broadcastDeviceStatus(deviceToken, "ONLINE", new Date());
      }

      const infoSummary: string[] = [];
      if (deviceInfo.firmware) infoSummary.push(`fw:${deviceInfo.firmware}`);
      if (deviceInfo.device) infoSummary.push(`device:${deviceInfo.device}`);
      if (deviceInfo.version) infoSummary.push(`ver:${deviceInfo.version}`);

      this.sendSuccessResponse(socket, message.id, "Device info stored");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error("Internal message handling error", { error: errorMessage });
      this.sendSuccessResponse(
        socket,
        message.id,
        "Device info processed (with errors)",
      );
    }
  }

  async sendHardwareCommand(
    deviceToken: string,
    command: string,
    pin: number,
    value: string | number | null = null,
  ): Promise<boolean> {
    try {
      const device = this.deviceManager.getDevice(deviceToken);
      if (!device || !device.socket) {
        logger.error("Device not found or not connected", {
          token: this.deviceManager.maskToken(deviceToken),
        });
        return false;
      }

      let bodyString: string;
      if (value !== null) {
        bodyString = `${command}\0${pin}\0${value}`;
      } else {
        bodyString = `${command}\0${pin}`;
      }

      const body = Buffer.from(bodyString, "utf8");
      const messageId = this.deviceManager.generateMessageId();

      const message = new SimpleMessage({
        type: PROTOCOL.CMD_HARDWARE,
        id: messageId,
        length: body.length,
        body,
      });

      const buffer = message.toBuffer();
      device.socket.write(buffer);

      logger.info("Hardware command sent", {
        token: this.deviceManager.maskToken(deviceToken),
        command,
        pin,
        value,
        messageId,
        bodyHex: body.toString("hex"),
      });

      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to send hardware command", {
        error: errorMessage,
        token: this.deviceManager.maskToken(deviceToken),
      });
      return false;
    }
  }

  async sendVirtualWrite(
    deviceToken: string,
    pin: number,
    value: string | number,
  ): Promise<boolean> {
    return await this.sendHardwareCommand(deviceToken, "vw", pin, value);
  }

  async sendVirtualRead(deviceToken: string, pin: number): Promise<boolean> {
    return await this.sendHardwareCommand(deviceToken, "vr", pin);
  }

  async sendDigitalWrite(
    deviceToken: string,
    pin: number,
    value: number,
  ): Promise<boolean> {
    return await this.sendHardwareCommand(deviceToken, "dw", pin, value);
  }

  async sendDigitalRead(deviceToken: string, pin: number): Promise<boolean> {
    return await this.sendHardwareCommand(deviceToken, "dr", pin);
  }

  private async handleLogin(
    socket: DeviceSocket,
    message: ParsedMessage,
  ): Promise<void> {
    try {
      const token = message.body.toString("utf8").trim();

      this.deviceManager.addDevice(token, socket);
      (socket as DeviceSocket & { deviceToken?: string }).deviceToken = token;

      this.deviceCache.updateDeviceInfo(token, {
        status: "ONLINE",
        lastPing: new Date(),
        lastLogin: new Date(),
        connectionCount: 1,
      });

      this.startDeviceHeartbeatMonitoring(token, socket);

      this.sendSuccessResponse(
        socket,
        message.id,
        `Login successful for ${this.deviceManager.maskToken(token)}`,
      );

      logger.info("Login successful", {
        token: this.deviceManager.maskToken(token),
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error("Login error", { error: errorMessage });
      this.sendSuccessResponse(
        socket,
        message.id,
        "Login processed (with errors)",
      );
    }
  }

  private startDeviceHeartbeatMonitoring(
    deviceToken: string,
    socket: DeviceSocket,
  ): void {
    const HEARTBEAT_TIMEOUT = 30000; // 30 seconds

    const heartbeatTimer = setInterval(async () => {
      const device = this.deviceManager.getDevice(deviceToken);
      if (!device || !device.socket || device.socket.destroyed) {
        // Device disconnected
        await this.handleDeviceDisconnection(deviceToken);
        clearInterval(heartbeatTimer);
        return;
      }

      // Check last activity
      const lastActivity =
        await this.deviceCache.getDeviceLastActivity(deviceToken);
      const now = new Date();
      const timeSinceLastActivity =
        now.getTime() - (lastActivity?.getTime() || 0);

      if (timeSinceLastActivity > HEARTBEAT_TIMEOUT) {
        await this.handleDeviceDisconnection(deviceToken);
        clearInterval(heartbeatTimer);
      }
    }, HEARTBEAT_TIMEOUT / 2); // Check every 15 seconds

    // Store timer reference for cleanup
    (socket as any).heartbeatTimer = heartbeatTimer;
  }

  private async handleDeviceDisconnection(deviceToken: string): Promise<void> {
    // Update cache immediately
    await this.deviceCache.updateDeviceInfo(deviceToken, {
      status: "OFFLINE",
      lastPing: new Date(),
      disconnectedAt: new Date(),
    });

    // Broadcast offline status
    this.wsManager.broadcastDeviceStatus(deviceToken, "OFFLINE", new Date());

    // Remove from device manager
    this.deviceManager.removeDevice(deviceToken);
  }

  private sendSuccessResponse(
    socket: DeviceSocket,
    messageId: number,
    description = "Success",
  ): void {
    try {
      const responseId =
        messageId === 0 ? this.deviceManager.generateMessageId() : messageId;

      const buffer = Buffer.alloc(5);
      buffer.writeUInt8(PROTOCOL.CMD_RESPONSE, 0);
      buffer.writeUInt16BE(responseId, 1);
      buffer.writeUInt16BE(PROTOCOL.STATUS_SUCCESS, 3);

      socket.write(buffer);

      logger.debug("Success response sent", {
        originalId: messageId,
        responseId: responseId,
        buffer: buffer.toString("hex"),
        description,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to send success response", { error: errorMessage });
    }
  }
}

export default SimpleProtocolHandler;
