import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage, Server } from "http";
import dotenv from "dotenv";
import logger from "./logger";
import { DeviceUpdate, WebSocketClient } from "@/types/websocket";

// Load environment variables
dotenv.config();

class WebSocketManager {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, WebSocketClient> = new Map();

  constructor() {
    // Will be initialized when HTTP server is created
  }

  initialize(server: Server) {
    this.wss = new WebSocketServer({
      server,
      path: "/api/ws",
    });

    this.wss.on("connection", this.handleConnection.bind(this));
    logger.info("WebSocket server initialized");
  }

  private handleConnection(ws: WebSocket, req: IncomingMessage) {
    const clientId = this.generateClientId();
    const client: WebSocketClient = {
      ws,
      subscriptions: new Set(),
    };

    this.clients.set(clientId, client);

    console.log("====================================");
    console.log(`🔌 WebSocket CLIENT CONNECTED: ${clientId}`);
    console.log(`   Total clients: ${this.clients.size}`);
    console.log("====================================");

    ws.on("message", (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        this.handleMessage(clientId, message);
      } catch (error) {
        console.error("Invalid WebSocket message:", error);
        this.sendError(ws, "Invalid message format");
      }
    });

    ws.on("close", () => {
      this.clients.delete(clientId);
      console.log("====================================");
      console.log(`🔌 WebSocket CLIENT DISCONNECTED: ${clientId}`);
      console.log(`   Remaining clients: ${this.clients.size}`);
      console.log("====================================");
    });

    ws.on("error", (error) => {
      logger.error("WebSocket error", { clientId, error: error.message });
      this.clients.delete(clientId);
    });

    // Send connection confirmation
    this.sendMessage(ws, {
      type: "CONNECTION_ESTABLISHED",
      clientId,
      timestamp: new Date().toISOString(),
    });
  }

  private handleMessage(clientId: string, message: any) {
    const client = this.clients.get(clientId);
    if (!client) return;

    console.log("====================================");
    console.log(`📨 WebSocket MESSAGE from ${clientId}:`, message.type);
    console.log("====================================");

    switch (message.type) {
      case "SUBSCRIBE_DEVICE":
        if (message.deviceId) {
          client.deviceId = message.deviceId;
          client.userId = message.userId;
          client.subscriptions.add(message.deviceId);

          this.sendMessage(client.ws, {
            type: "SUBSCRIPTION_CONFIRMED",
            deviceId: message.deviceId,
            timestamp: new Date().toISOString(),
          });

          console.log(
            `✅ Client ${clientId} subscribed to device ${message.deviceId}`,
          );
        }
        break;

      case "UNSUBSCRIBE_DEVICE":
        if (message.deviceId) {
          client.subscriptions.delete(message.deviceId);
          console.log(
            `❌ Client ${clientId} unsubscribed from device ${message.deviceId}`,
          );
        }
        break;

      case "PING":
        this.sendMessage(client.ws, {
          type: "PONG",
          timestamp: new Date().toISOString(),
        });
        break;
    }
  }

  // Main method to broadcast hardware data updates
  broadcastHardwareUpdate(
    deviceToken: string,
    pin: number,
    value: string | number,
    command: string,
  ) {
    if (!this.wss) return;

    // You need to map deviceToken to deviceId - implement this based on your database
    this.getDeviceIdFromToken(deviceToken)
      .then((deviceId) => {
        if (deviceId) {
          const update: DeviceUpdate = {
            deviceId,
            pin,
            value,
            timestamp: new Date().toISOString(),
            command,
          };

          const message = {
            type: "HARDWARE_DATA",
            deviceId,
            data: update,
          };

          console.log("====================================");
          console.log(`📡 BROADCASTING HARDWARE UPDATE`);
          console.log(`   Device: ${deviceId}`);
          console.log(`   Pin: ${pin}, Value: ${value}`);
          console.log(`   Subscribers: ${this.getDeviceSubscribers(deviceId)}`);
          console.log("====================================");

          this.broadcastToSubscribers(deviceId, message);
        }
      })
      .catch((error) => {
        logger.error("Error getting device ID for broadcast", {
          error: error.message,
          deviceToken,
        });
      });
  }

  // Broadcast device status updates
  broadcastDeviceStatus(deviceToken: string, status: string, lastPing?: Date) {
    if (!this.wss) return;

    this.getDeviceIdFromToken(deviceToken).then((deviceId) => {
      if (deviceId) {
        const message = {
          type: "DEVICE_STATUS",
          deviceId,
          data: {
            status,
            lastPing: lastPing?.toISOString(),
            timestamp: new Date().toISOString(),
          },
        };

        this.broadcastToSubscribers(deviceId, message);
      }
    });
  }

  private broadcastToSubscribers(deviceId: string, message: any) {
    let subscriberCount = 0;

    for (const [clientId, client] of this.clients.entries()) {
      if (
        client.subscriptions.has(deviceId) &&
        client.ws.readyState === WebSocket.OPEN
      ) {
        try {
          this.sendMessage(client.ws, message);
          subscriberCount++;
        } catch (error) {
          logger.error(`Error sending message to client ${clientId}`, {
            error,
          });
          this.clients.delete(clientId);
        }
      }
    }

    if (subscriberCount > 0) {
      logger.info("Message broadcasted", {
        deviceId,
        subscriberCount,
        type: message.type,
      });
    }
  }

  private sendMessage(ws: WebSocket, message: any) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  private sendError(ws: WebSocket, error: string) {
    this.sendMessage(ws, {
      type: "ERROR",
      error,
      timestamp: new Date().toISOString(),
    });
  }

  // Helper method to map device token to device ID
  private async getDeviceIdFromToken(
    deviceToken: string,
  ): Promise<string | null> {
    try {
      const baseUrl =
        process.env.API_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL;
      // This should match your database structure
      const response = await fetch(
        `${baseUrl}/api/devices/by-token/${deviceToken}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        return data.id;
      }
    } catch (error) {
      console.log("====================================");
      console.log("Error mapping token to device ID", error);
      console.log("====================================");

      logger.error("Error mapping token to device ID", {
        error,
        deviceToken: deviceToken.substring(0, 8) + "...",
      });
    }
    return null;
  }

  private generateClientId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  getConnectedClients(): number {
    return this.clients.size;
  }

  getDeviceSubscribers(deviceId: string): number {
    return Array.from(this.clients.values()).filter((client) =>
      client.subscriptions.has(deviceId),
    ).length;
  }

  // Method to get stats for monitoring
  getStats() {
    const deviceSubscriptions: Record<string, number> = {};

    for (const client of this.clients.values()) {
      for (const deviceId of client.subscriptions) {
        deviceSubscriptions[deviceId] =
          (deviceSubscriptions[deviceId] || 0) + 1;
      }
    }

    return {
      totalClients: this.clients.size,
      deviceSubscriptions,
    };
  }
}

export default WebSocketManager;
