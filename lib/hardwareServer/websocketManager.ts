import { WebSocketServer, WebSocket } from "ws";
import type { IncomingMessage, Server } from "http";
import dotenv from "dotenv";
import logger from "./logger";
import type DeviceCacheManager from "./deviceCacheManager";
import type { DeviceUpdate, WebSocketClient } from "@/types/websocket";

// Load environment variables
dotenv.config();

class WebSocketManager {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, WebSocketClient> = new Map();
  private deviceCache: DeviceCacheManager;

  constructor(deviceCache: DeviceCacheManager) {
    this.deviceCache = deviceCache;
  }

  initialize(server: Server) {
    this.wss = new WebSocketServer({
      server,
      path: "/api/ws",
    });

    this.wss.on("connection", this.handleConnection.bind(this));
    logger.info("WebSocket server initialized with device cache");
  }

  private handleConnection(ws: WebSocket, req: IncomingMessage) {
    const clientId = this.generateClientId();
    const client: WebSocketClient = {
      ws,
      subscriptions: new Set(),
    };

    this.clients.set(clientId, client);

    console.log("====================================");
    console.log(`📌 WebSocket CLIENT CONNECTED: ${clientId}`);
    console.log(`   Total clients: ${this.clients.size}`);
    console.log(`   Cache ready: ${this.deviceCache.isReady()}`);
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
      console.log(`📌 WebSocket CLIENT DISCONNECTED: ${clientId}`);
      console.log(`   Remaining clients: ${this.clients.size}`);
      console.log("====================================");
    });

    ws.on("error", (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error("WebSocket error", { clientId, error: errorMessage });
      this.clients.delete(clientId);
    });

    // Send connection confirmation with cache status
    this.sendMessage(ws, {
      type: "CONNECTION_ESTABLISHED",
      clientId,
      cacheReady: this.deviceCache.isReady(),
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

          // Initialize cache if not already done and we have user info
          if (
            !this.deviceCache.isReady() &&
            message.userId &&
            message.organizationId
          ) {
            this.initializeCacheForUser(message.userId, message.organizationId);
          }

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
          cacheStats: this.deviceCache.getStats(),
          timestamp: new Date().toISOString(),
        });
        break;

      case "INITIALIZE_CACHE":
        // Allow clients to manually trigger cache initialization
        if (message.userId && message.organizationId) {
          this.initializeCacheForUser(message.userId, message.organizationId);
        }
        break;

      case "REFRESH_DEVICE":
        if (message.deviceId) {
          this.handleDeviceRefresh(clientId, message.deviceId);
        }
        break;
    }
  }

  /**
   * Initialize device cache for a specific user
   */
  private async initializeCacheForUser(userId: string, organizationId: string) {
    if (this.deviceCache.isReady()) {
      logger.info("Device cache already initialized");
      return;
    }

    try {
      await this.deviceCache.initializeUserDevices(userId, organizationId);

      // Notify all clients that cache is ready
      this.broadcastToAll({
        type: "CACHE_INITIALIZED",
        timestamp: new Date().toISOString(),
        stats: this.deviceCache.getStats(),
      });

      console.log("====================================");
      console.log("🚀 DEVICE CACHE INITIALIZED");
      console.log(`   User ID: ${userId}`);
      console.log(`   Organization ID: ${organizationId}`);
      console.log(
        `   Devices cached: ${this.deviceCache.getStats().deviceCount}`,
      );
      console.log("====================================");
    } catch (error) {
      logger.error("Failed to initialize device cache", {
        userId,
        organizationId,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  /**
   * Main method to broadcast hardware data updates (NOW INSTANT!)
   */
  async broadcastHardwareUpdate(
    deviceToken: string,
    pin: number,
    value: string | number,
    command: string,
    isCmd20 = false, // Add CMD:20 priority flag
  ) {
    if (!this.wss) return;

    // INSTANT lookup from cache - no API call!
    const result = await this.deviceCache.updateHardwareData(
      deviceToken,
      pin,
      value,
      command,
      isCmd20, // Pass CMD:20 flag to cache
    );

    if (result) {
      const { deviceId, updatedWidget } = result;

      const update: DeviceUpdate = {
        deviceId,
        pin,
        value,
        timestamp: new Date().toISOString(),
        command,
        isCmd20,
        widget: updatedWidget
          ? {
              id: updatedWidget.id,
              value: updatedWidget.value,
              pinConfig: updatedWidget.pinConfig,
            }
          : undefined,
      };

      const message = {
        type: "HARDWARE_DATA",
        deviceId,
        data: update,
        priority: isCmd20 ? "HIGH" : "NORMAL",
      };

      console.log("====================================");
      console.log(
        `🚀 ${isCmd20 ? "PRIORITY CMD:20" : "INSTANT"} HARDWARE UPDATE BROADCAST`,
      );
      console.log(`   Device: ${deviceId}`);
      console.log(`   Pin: ${pin}, Value: ${value}`);
      console.log(`   Widget updated: ${!!updatedWidget}`);
      console.log(`   CMD:20: ${isCmd20 ? "YES" : "NO"}`);
      console.log(`   Subscribers: ${this.getDeviceSubscribers(deviceId)}`);
      console.log("====================================");

      this.broadcastToSubscribers(deviceId, message);

      if (isCmd20 && updatedWidget) {
        this.broadcastWidgetStateSync(deviceId, updatedWidget);
      }

      // Update device status to ONLINE
      this.deviceCache.updateDeviceInfo(deviceToken, {
        status: "ONLINE",
        lastPing: new Date(),
        lastActivity: new Date(),
      });
    } else {
      logger.warn("Hardware update failed - device not in cache", {
        deviceToken: deviceToken.substring(0, 8) + "...",
        pin,
        value,
      });
    }
  }

  private broadcastWidgetStateSync(deviceId: string, widget: any) {
    const message = {
      type: "WIDGET_STATE_SYNC",
      deviceId,
      data: {
        widgetId: widget.id,
        pin: widget.pinConfig.pinNumber,
        value: widget.value,
        timestamp: new Date().toISOString(),
        forceUpdate: true, // Force UI to update immediately
      },
    };

    this.broadcastToSubscribers(deviceId, message);

    console.log("🔄 WIDGET STATE SYNC BROADCAST", {
      deviceId,
      widgetId: widget.id,
      pin: widget.pinConfig.pinNumber,
      value: widget.value,
    });
  }

  /**
   * Broadcast device status updates (using cache)
   */
  async broadcastDeviceStatus(
    deviceToken: string,
    status: string,
    lastPing?: Date,
  ) {
    if (!this.wss) return;

    this.deviceCache.updateDeviceInfo(deviceToken, {
      status: status as "ONLINE" | "OFFLINE",
      lastPing: lastPing || new Date(),
      lastActivity: new Date(),
      statusChangeTime: new Date(),
    });

    // Get device ID from cache
    const deviceId = await this.deviceCache.getDeviceIdFromToken(deviceToken);

    if (deviceId) {
      const message = {
        type: "DEVICE_STATUS",
        deviceId,
        data: {
          status,
          lastPing: (lastPing || new Date()).toISOString(),
          timestamp: new Date().toISOString(),
          realTime: true, // Flag to indicate real-time status update
        },
      };

      this.broadcastToSubscribers(deviceId, message);

      console.log("📡 DEVICE STATUS BROADCAST", {
        deviceId,
        status,
        subscribers: this.getDeviceSubscribers(deviceId),
      });
    }
  }

  /**
   * Send real-time widget updates directly to DeviceDetails
   */
  broadcastWidgetUpdate(deviceId: string, widgets: any[]) {
    const message = {
      type: "WIDGET_UPDATE",
      deviceId,
      data: {
        widgets,
        timestamp: new Date().toISOString(),
      },
    };

    this.broadcastToSubscribers(deviceId, message);
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
      logger.info("Message broadcasted instantly", {
        deviceId,
        subscriberCount,
        type: message.type,
      });
    }
  }

  private broadcastToAll(message: any) {
    for (const [clientId, client] of this.clients.entries()) {
      if (client.ws.readyState === WebSocket.OPEN) {
        try {
          this.sendMessage(client.ws, message);
        } catch (error) {
          logger.error(`Error broadcasting to client ${clientId}`, { error });
          this.clients.delete(clientId);
        }
      }
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

  /**
   * Get enhanced stats including cache information
   */
  getStats() {
    const deviceSubscriptions: Record<string, number> = {};

    for (const client of this.clients.values()) {
      for (const deviceId of client.subscriptions) {
        deviceSubscriptions[deviceId] =
          (deviceSubscriptions[deviceId] || 0) + 1;
      }
    }

    return {
      websocket: {
        totalClients: this.clients.size,
        deviceSubscriptions,
      },
      cache: this.deviceCache.getStats(),
    };
  }

  /**
   * Clean up resources
   */
  cleanup() {
    if (this.deviceCache) {
      this.deviceCache.cleanup();
    }

    for (const [clientId, client] of this.clients.entries()) {
      client.ws.close();
    }

    this.clients.clear();
    logger.info("WebSocket manager cleaned up");
  }

  private async handleDeviceRefresh(clientId: string, deviceId: string) {
    try {
      const device = await this.deviceCache.getDevice(deviceId);
      if (device) {
        const client = this.clients.get(clientId);
        if (client) {
          // Send fresh device data
          this.sendMessage(client.ws, {
            type: "DEVICE_REFRESH",
            deviceId,
            data: {
              device: {
                id: device.id,
                name: device.name,
                status: device.status,
                lastPing: device.lastPing.toISOString(),
              },
              widgets: device.widgets,
              timestamp: new Date().toISOString(),
            },
          });
        }
      }
    } catch (error) {
      logger.error("Failed to refresh device", { clientId, deviceId, error });
    }
  }
}

export default WebSocketManager;
