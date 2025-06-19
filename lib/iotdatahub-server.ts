import net from "net";
import { EventEmitter } from "events";
import prisma from "@/prisma/client";
import { IoTDATAHUB_PROTOCOL } from "@/app/store/constant";

interface IoTDataHubMessage {
  type: number;
  msgId: number;
  length: number;
  body: Buffer;
}

interface IoTDataHubConnection {
  socket: net.Socket;
  deviceId?: string;
  authToken?: string;
  authenticated: boolean;
  lastPing: number;
}

export class IoTDataHubTCPServer extends EventEmitter {
  private server: net.Server;
  private connections: Map<string, IoTDataHubConnection> = new Map();
  private port: number;

  constructor(port: number = IoTDATAHUB_PROTOCOL.DEFAULT_PORT) {
    super();
    this.port = port;
    this.server = net.createServer(this.handleConnection.bind(this));

    // Heartbeat check every 30 seconds
    setInterval(this.checkHeartbeat.bind(this), 30000);
  }

  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.listen(this.port, (err?: Error) => {
        if (err) reject(err);
        else {
          console.log(`IoTDataHub TCP Server listening on port ${this.port}`);
          resolve();
        }
      });
    });
  }

  private handleConnection(socket: net.Socket) {
    const connectionId = `${socket.remoteAddress}:${socket.remotePort}`;
    const connection: IoTDataHubConnection = {
      socket,
      authenticated: false,
      lastPing: Date.now(),
    };

    this.connections.set(connectionId, connection);
    console.log(`New connection: ${connectionId}`);

    socket.on("data", (data) => this.handleData(connectionId, data));
    socket.on("close", () => this.handleDisconnection(connectionId));
    socket.on("error", (err) => this.handleError(connectionId, err));
  }

  private handleData(connectionId: string, data: Buffer) {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    try {
      const message = this.parseMessage(data);
      this.processMessage(connectionId, message);
    } catch (error) {
      console.error("Error parsing message:", error);
      this.sendResponse(
        connectionId,
        IoTDATAHUB_PROTOCOL.STATUS_ILLEGAL_COMMAND_BODY,
        0,
      );
    }
  }

  private parseMessage(data: Buffer): IoTDataHubMessage {
    if (data.length < 5) {
      throw new Error("Message too short");
    }

    const type = data.readUInt8(0);
    const msgId = data.readUInt16BE(1);
    const length = data.readUInt16BE(3);
    const body = data.slice(5, 5 + length);

    return { type, msgId, length, body };
  }

  private async processMessage(
    connectionId: string,
    message: IoTDataHubMessage,
  ) {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    switch (message.type) {
      case IoTDATAHUB_PROTOCOL.CMD_LOGIN:
        await this.handleLogin(connectionId, message);
        break;

      case IoTDATAHUB_PROTOCOL.CMD_PING:
        this.handlePing(connectionId, message);
        break;

      case IoTDATAHUB_PROTOCOL.CMD_HARDWARE:
        await this.handleHardware(connectionId, message);
        break;

      case IoTDATAHUB_PROTOCOL.CMD_INTERNAL:
        await this.handleInternal(connectionId, message);
        break;

      default:
        this.sendResponse(
          connectionId,
          IoTDATAHUB_PROTOCOL.STATUS_ILLEGAL_COMMAND,
          message.msgId,
        );
    }
  }

  private async handleLogin(connectionId: string, message: IoTDataHubMessage) {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    const authToken = message.body.toString("utf8");

    try {
      const device = await prisma.device.findUnique({
        where: { authToken },
      });

      if (!device) {
        this.sendResponse(
          connectionId,
          IoTDATAHUB_PROTOCOL.STATUS_INVALID_TOKEN,
          message.msgId,
        );
        return;
      }

      // Update connection
      connection.authToken = authToken;
      connection.deviceId = device.id;
      connection.authenticated = true;

      // Update device status
      await prisma.device.update({
        where: { id: device.id },
        data: {
          status: "ONLINE",
          lastPing: new Date(),
          metadata: {
            ip: connection.socket.remoteAddress,
            port: connection.socket.remotePort,
            connectedAt: new Date(),
          },
        },
      });

      this.sendResponse(
        connectionId,
        IoTDATAHUB_PROTOCOL.STATUS_SUCCESS,
        message.msgId,
      );

      // Emit connection event
      this.emit("deviceConnected", { deviceId: device.id, authToken });
    } catch (error) {
      console.error("Login error:", error);
      this.sendResponse(
        connectionId,
        IoTDATAHUB_PROTOCOL.STATUS_SERVER_EXCEPTION,
        message.msgId,
      );
    }
  }

  private handlePing(connectionId: string, message: IoTDataHubMessage) {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    connection.lastPing = Date.now();
    this.sendResponse(
      connectionId,
      IoTDATAHUB_PROTOCOL.STATUS_SUCCESS,
      message.msgId,
    );
  }

  private async handleInternal(
    connectionId: string,
    message: IoTDataHubMessage,
  ) {
    // Handle internal commands (placeholder - implement specific internal command handling)
    this.sendResponse(
      connectionId,
      IoTDATAHUB_PROTOCOL.STATUS_SUCCESS,
      message.msgId,
    );
  }

  private async handleHardware(
    connectionId: string,
    message: IoTDataHubMessage,
  ) {
    const connection = this.connections.get(connectionId);
    if (!connection || !connection.authenticated) {
      this.sendResponse(
        connectionId,
        IoTDATAHUB_PROTOCOL.STATUS_NOT_AUTHENTICATED,
        message.msgId,
      );
      return;
    }

    const bodyStr = message.body.toString("utf8");
    const parts = bodyStr.split("\0");

    if (parts.length < 2) return;

    const command = parts[0];

    try {
      switch (command) {
        case "vw": // Virtual write
          if (parts.length >= 3) {
            await this.handleVirtualWrite(
              connection.deviceId!,
              parseInt(parts[1]),
              parts[2],
            );
          }
          break;

        case "vr": // Virtual read
          if (parts.length >= 2) {
            await this.handleVirtualRead(
              connectionId,
              connection.deviceId!,
              parseInt(parts[1]),
            );
          }
          break;
      }

      this.sendResponse(
        connectionId,
        IoTDATAHUB_PROTOCOL.STATUS_SUCCESS,
        message.msgId,
      );
    } catch (error) {
      console.error("Hardware command error:", error);
      this.sendResponse(
        connectionId,
        IoTDATAHUB_PROTOCOL.STATUS_SERVER_EXCEPTION,
        message.msgId,
      );
    }
  }

  private async handleVirtualWrite(
    deviceId: string,
    pinNumber: number,
    value: string,
  ) {
    try {
      await prisma.virtualPin.upsert({
        where: {
          deviceId_pinNumber: {
            deviceId,
            pinNumber,
          },
        },
        update: {
          value,
          lastUpdated: new Date(),
        },
        create: {
          deviceId,
          pinNumber,
          value,
          dataType: this.detectDataType(value),
        },
      });

      // Emit data update event for WebSocket broadcasting
      this.emit("virtualPinUpdate", { deviceId, pinNumber, value });
    } catch (error) {
      console.error("Virtual write error:", error);
      throw error;
    }
  }

  private async handleVirtualRead(
    connectionId: string,
    deviceId: string,
    pinNumber: number,
  ) {
    try {
      const pin = await prisma.virtualPin.findUnique({
        where: {
          deviceId_pinNumber: {
            deviceId,
            pinNumber,
          },
        },
      });

      if (pin) {
        // Send value back to device
        const response = `vw\0${pinNumber}\0${pin.value || ""}`;
        this.sendHardwareCommand(connectionId, response);
      }
    } catch (error) {
      console.error("Virtual read error:", error);
    }
  }

  private detectDataType(
    value: string,
  ): "STRING" | "INTEGER" | "FLOAT" | "BOOLEAN" {
    if (value === "true" || value === "false") return "BOOLEAN";
    if (/^\d+$/.test(value)) return "INTEGER";
    if (/^\d*\.\d+$/.test(value)) return "FLOAT";
    return "STRING";
  }

  private sendResponse(
    connectionId: string,
    status: number,
    msgId: number,
    body?: Buffer,
  ) {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    const bodyLength = body ? body.length : 0;
    const header = Buffer.alloc(5);

    header.writeUInt8(IoTDATAHUB_PROTOCOL.CMD_RESPONSE, 0);
    header.writeUInt16BE(msgId, 1);
    header.writeUInt16BE(bodyLength, 3);

    if (body) {
      connection.socket.write(Buffer.concat([header, body]));
    } else {
      connection.socket.write(header);
    }
  }

  private sendHardwareCommand(connectionId: string, command: string) {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    const body = Buffer.from(command, "utf8");
    const header = Buffer.alloc(5);

    header.writeUInt8(IoTDATAHUB_PROTOCOL.CMD_HARDWARE, 0);
    header.writeUInt16BE(0, 1); // msg id
    header.writeUInt16BE(body.length, 3);

    connection.socket.write(Buffer.concat([header, body]));
  }

  private async handleDisconnection(connectionId: string) {
    const connection = this.connections.get(connectionId);
    if (connection && connection.authenticated && connection.deviceId) {
      // Update device status to offline
      try {
        await prisma.device.update({
          where: { id: connection.deviceId },
          data: {
            status: "OFFLINE",
            lastPing: new Date(),
          },
        });

        this.emit("deviceDisconnected", { deviceId: connection.deviceId });
      } catch (error) {
        console.error("Error updating device status on disconnect:", error);
      }
    }

    this.connections.delete(connectionId);
    console.log(`Connection closed: ${connectionId}`);
  }

  private handleError(connectionId: string, error: Error) {
    console.error(`Connection error ${connectionId}:`, error);
    this.connections.delete(connectionId);
  }

  private checkHeartbeat() {
    const now = Date.now();
    const timeout = 60000; // 60 seconds timeout

    for (const [connectionId, connection] of this.connections) {
      if (now - connection.lastPing > timeout) {
        console.log(`Connection timeout: ${connectionId}`);
        connection.socket.destroy();
        this.connections.delete(connectionId);
      }
    }
  }

  // Send command to device
  async sendToDevice(authToken: string, command: string): Promise<boolean> {
    for (const connection of this.connections.values()) {
      if (connection.authToken === authToken && connection.authenticated) {
        this.sendHardwareCommand(
          `${connection.socket.remoteAddress}:${connection.socket.remotePort}`,
          command,
        );
        return true;
      }
    }
    return false;
  }
}
