const { PROTOCOL } = require("./constants");
const SimpleMessage = require("./message");
const { parseHardwareCommand, parseDeviceInfo } = require("./commandParser");
const { storeDeviceInfo, storeHardwareData } = require("./dataStorage");
const logger = require("./logger");

// Simple Protocol Handler with Enhanced Logging
class SimpleProtocolHandler {
  constructor(deviceManager) {
    this.deviceManager = deviceManager;
  }

  async handleMessage(socket, message, deviceToken) {
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
      logger.error("Message handling error", { error: error.message });
      // Still send success even on error
      this.sendSuccessResponse(
        socket,
        message.id,
        `Error handled: ${error.message}`,
      );
    }
  }

  async handleDeviceInfoMessage(socket, message, deviceToken) {
    const clientIP = socket.remoteAddress?.replace("::ffff:", "") || "unknown";

    try {
      const deviceInfo = parseDeviceInfo(message.body);

      if (Object.keys(deviceInfo).length > 0 && deviceToken) {
        await storeDeviceInfo(deviceToken, deviceInfo, clientIP);
      }

      // Enhanced logging for device info
      const infoSummary = [];
      if (deviceInfo.firmware) infoSummary.push(`fw:${deviceInfo.firmware}`);
      if (deviceInfo.device) infoSummary.push(`device:${deviceInfo.device}`);
      if (deviceInfo.version) infoSummary.push(`ver:${deviceInfo.version}`);

      console.log("====================================");
      console.log(`📋 DEVICE INFO RECEIVED`);
      console.log(
        `   Device: ${deviceToken ? this.deviceManager.maskToken(deviceToken) : "UNKNOWN"}`,
      );
      console.log(`   IP: ${clientIP}`);
      console.log(`   Info: ${infoSummary.join(", ") || "No parsed info"}`);
      console.log("====================================");

      this.sendSuccessResponse(socket, message.id, "Device info stored");
    } catch (error) {
      logger.error("Internal message handling error", { error: error.message });
      this.sendSuccessResponse(
        socket,
        message.id,
        "Device info processed (with errors)",
      );
    }
  }

  async handleHardwareMessage(socket, message, deviceToken) {
    try {
      const parsedCommand = parseHardwareCommand(message.body);

      if (parsedCommand && deviceToken) {
        logger.info("Hardware command parsed", {
          token: this.deviceManager.maskToken(deviceToken),
          command: parsedCommand,
        });

        // Enhanced logging for hardware commands
        console.log("====================================");
        console.log(`🔧 HARDWARE COMMAND EXECUTED`);
        console.log(`   Device: ${this.deviceManager.maskToken(deviceToken)}`);
        console.log(`   Command: ${parsedCommand.type}`);
        console.log(`   Pin: ${parsedCommand.pin}`);
        if (parsedCommand.value !== undefined) {
          console.log(`   Value: ${parsedCommand.value}`);
        }
        console.log("====================================");

        // Store virtual pin data
        if (parsedCommand.type === "VIRTUAL_WRITE") {
          const device = this.deviceManager.getDevice(deviceToken);
          if (device) {
            device.virtualPins.set(parsedCommand.pin.toString(), {
              value: parsedCommand.value,
              timestamp: Date.now(),
            });
          }
          await storeHardwareData(
            deviceToken,
            parsedCommand.pin,
            parsedCommand.value,
          );
          this.sendSuccessResponse(
            socket,
            message.id,
            `VirtualWrite(${parsedCommand.pin}=${parsedCommand.value}) executed`,
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
      logger.error("Hardware message handling error", { error: error.message });
      this.sendSuccessResponse(
        socket,
        message.id,
        "Hardware command processed (with errors)",
      );
    }
  }

  async sendHardwareCommand(deviceToken, command, pin, value = null) {
    try {
      const device = this.deviceManager.getDevice(deviceToken);
      if (!device || !device.socket) {
        logger.error("Device not found or not connected", {
          token: this.deviceManager.maskToken(deviceToken),
        });
        return false;
      }

      let bodyString;
      if (value !== null) {
        bodyString = `${command}\0${pin}\0${value}`;
      } else {
        bodyString = `${command}\0${pin}`;
      }

      const body = Buffer.from(bodyString, "utf8");
      const messageId = this.deviceManager.generateMessageId();

      const message = new SimpleMessage(
        PROTOCOL.CMD_HARDWARE,
        messageId,
        body.length,
        body,
      );

      const buffer = message.toBuffer();
      device.socket.write(buffer);

      // Enhanced logging for sent commands
      const commandNames = {
        vw: "VirtualWrite",
        vr: "VirtualRead",
        dw: "DigitalWrite",
        dr: "DigitalRead",
      };

      const commandName = commandNames[command] || command.toUpperCase();

      console.log("====================================");
      console.log(`📤 SENDING COMMAND TO DEVICE`);
      console.log(`   Device: ${this.deviceManager.maskToken(deviceToken)}`);
      console.log(`   Command: ${commandName}`);
      console.log(`   Pin: ${pin}`);
      if (value !== null) {
        console.log(`   Value: ${value}`);
      }
      console.log(`   Message ID: ${messageId}`);
      console.log("====================================");

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
      logger.error("Failed to send hardware command", {
        error: error.message,
        token: this.deviceManager.maskToken(deviceToken),
      });
      return false;
    }
  }

  async sendVirtualWrite(deviceToken, pin, value) {
    return await this.sendHardwareCommand(deviceToken, "vw", pin, value);
  }

  async sendVirtualRead(deviceToken, pin) {
    return await this.sendHardwareCommand(deviceToken, "vr", pin);
  }

  async sendDigitalWrite(deviceToken, pin, value) {
    return await this.sendHardwareCommand(deviceToken, "dw", pin, value);
  }

  async sendDigitalRead(deviceToken, pin) {
    return await this.sendHardwareCommand(deviceToken, "dr", pin);
  }

  async handleLogin(socket, message) {
    try {
      const token = message.body.toString("utf8").trim();

      this.deviceManager.addDevice(token, socket);
      socket.deviceToken = token;

      console.log("====================================");
      console.log(`🔐 DEVICE LOGIN SUCCESSFUL`);
      console.log(`   Token: ${this.deviceManager.maskToken(token)}`);
      console.log(`   Client: ${socket.remoteAddress}:${socket.remotePort}`);
      console.log(`   Status: Authenticated and ready`);
      console.log("====================================");

      this.sendSuccessResponse(
        socket,
        message.id,
        `Login successful for ${this.deviceManager.maskToken(token)}`,
      );

      logger.info("Login successful", {
        token: this.deviceManager.maskToken(token),
      });
    } catch (error) {
      logger.error("Login error", { error: error.message });
      this.sendSuccessResponse(
        socket,
        message.id,
        "Login processed (with errors)",
      );
    }
  }

  sendSuccessResponse(socket, messageId, description = "Success") {
    try {
      const responseId =
        messageId === 0 ? this.deviceManager.generateMessageId() : messageId;

      const buffer = Buffer.alloc(5);
      buffer.writeUInt8(PROTOCOL.CMD_RESPONSE, 0);
      buffer.writeUInt16BE(responseId, 1);
      buffer.writeUInt16BE(PROTOCOL.STATUS_SUCCESS, 3);

      socket.write(buffer);

      console.log("====================================");
      console.log(`✅ RESPONSE SENT: ${description}`);
      console.log(`   Message ID: ${responseId}`);
      console.log(`   Status: 200 (SUCCESS)`);
      console.log(`   Buffer: ${buffer.toString("hex")}`);
      console.log("====================================");

      logger.debug("Success response sent", {
        originalId: messageId,
        responseId: responseId,
        buffer: buffer.toString("hex"),
        description,
      });
    } catch (error) {
      logger.error("Failed to send success response", { error: error.message });
    }
  }
}

module.exports = SimpleProtocolHandler;
