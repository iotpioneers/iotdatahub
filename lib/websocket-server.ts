import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import jwt from "jsonwebtoken";
import prisma from "@/prisma/client";

interface WSClient {
  ws: WebSocket;
  deviceId?: string;
  userId?: string;
  subscriptions: Set<string>;
}

export class IoTDataHubWebSocketServer {
  private wss: WebSocketServer;
  private clients: Map<WebSocket, WSClient> = new Map();

  constructor(port: number = Number(process.env.WS_PORT!) || 8081) {
    this.wss = new WebSocketServer({ port });
    this.setupEventHandlers();
    console.log(`WebSocket server running on port ${port}`);
  }

  private setupEventHandlers() {
    this.wss.on("connection", (ws: WebSocket, request: IncomingMessage) => {
      const client: WSClient = {
        ws,
        subscriptions: new Set(),
      };

      this.clients.set(ws, client);
      console.log("WebSocket client connected");

      ws.on("message", (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(client, message);
        } catch (error) {
          console.error("Invalid WebSocket message:", error);
        }
      });

      ws.on("close", () => {
        this.clients.delete(ws);
        console.log("WebSocket client disconnected");
      });

      ws.on("error", (error) => {
        console.error("WebSocket error:", error);
        this.clients.delete(ws);
      });
    });
  }

  private handleMessage(client: WSClient, message: any) {
    switch (message.type) {
      case "subscribe":
        if (message.deviceId) {
          client.subscriptions.add(message.deviceId);
          client.deviceId = message.deviceId;
          this.sendToClient(client, {
            type: "subscribed",
            deviceId: message.deviceId,
          });
        }
        break;

      case "unsubscribe":
        if (message.deviceId) {
          client.subscriptions.delete(message.deviceId);
        }
        break;

      case "authenticate":
        this.authenticateClient(client, message.token);
        break;

      case "virtual_write":
        this.handleVirtualWrite(client, message);
        break;

      case "get_device_status":
        this.sendDeviceStatus(client, message.deviceId);
        break;
    }
  }

  private async authenticateClient(client: WSClient, token: string) {
    try {
      // Verify JWT token or API key
      const decoded = jwt.verify(
        token,
        process.env.NEXTAUTH_SECRET || "secret",
      ) as any;
      client.userId = decoded.sub;

      this.sendToClient(client, {
        type: "authenticated",
        userId: client.userId,
      });
    } catch (error) {
      this.sendToClient(client, {
        type: "authentication_failed",
        error: "Invalid token",
      });
    }
  }

  private async handleVirtualWrite(client: WSClient, message: any) {
    const { deviceId, pin, value } = message;

    try {
      // Update database
      await prisma.virtualPin.upsert({
        where: {
          deviceId_pinNumber: {
            deviceId,
            pinNumber: parseInt(pin.replace("V", "")),
          },
        },
        update: {
          value: value.toString(),
          lastUpdated: new Date(),
        },
        create: {
          deviceId,
          pinNumber: parseInt(pin.replace("V", "")),
          value: value.toString(),
          dataType: this.detectDataType(value.toString()),
        },
      });

      // Broadcast to subscribed clients
      this.broadcast(
        {
          type: "virtual_pin_update",
          deviceId,
          pin,
          value,
          timestamp: new Date().toISOString(),
        },
        deviceId,
      );

      // Send to hardware if connected
      if (global.iotdatahubServer) {
        const device = await prisma.device.findUnique({
          where: { id: deviceId },
        });
        if (device?.authToken) {
          const command = `vw\0${pin.replace("V", "")}\0${value}`;
          await global.iotdatahubServer.sendToDevice(device.authToken, command);
        }
      }
    } catch (error) {
      console.error("Virtual write error:", error);
      this.sendToClient(client, {
        type: "error",
        message: "Failed to write virtual pin",
      });
    }
  }

  private async sendDeviceStatus(client: WSClient, deviceId: string) {
    try {
      const device = await prisma.device.findUnique({
        where: { id: deviceId },
        include: {
          virtualPins: true,
          events: {
            orderBy: { createdAt: "desc" },
            take: 10,
          },
        },
      });

      if (device) {
        this.sendToClient(client, {
          type: "device_status",
          device,
        });
      }
    } catch (error) {
      console.error("Error fetching device status:", error);
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

  private sendToClient(client: WSClient, message: any) {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  }

  public broadcast(message: any, deviceId?: string) {
    for (const client of this.clients.values()) {
      if (!deviceId || client.subscriptions.has(deviceId)) {
        this.sendToClient(client, message);
      }
    }
  }

  public getClientCount(): number {
    return this.clients.size;
  }
}
