import { IoTDataHubTCPServer } from "./iotdatahub-server";
import { IoTDataHubWebSocketServer } from "./websocket-server";

declare global {
  var iotdatahubServer: IoTDataHubTCPServer;
  var wsServer: IoTDataHubWebSocketServer;
}

class IoTDataHubServerManager {
  private tcpServer?: IoTDataHubTCPServer;
  private wsServer?: IoTDataHubWebSocketServer;
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    try {
      // Initialize TCP server
      this.tcpServer = new IoTDataHubTCPServer(
        Number(process.env.TCP_PORT!) || 8080 || 80 || 443,
      );
      await this.tcpServer.start();

      // Initialize WebSocket server
      this.wsServer = new IoTDataHubWebSocketServer(
        Number(process.env.WS_PORT!) || 8081,
      );

      // Connect servers
      this.tcpServer.on("virtualPinUpdate", (data) => {
        this.wsServer?.broadcast(
          {
            type: "virtual_pin_update",
            ...data,
            timestamp: new Date().toISOString(),
          },
          data.deviceId,
        );
      });

      this.tcpServer.on("deviceConnected", (data) => {
        this.wsServer?.broadcast({
          type: "device_connected",
          ...data,
          timestamp: new Date().toISOString(),
        });
      });

      this.tcpServer.on("deviceDisconnected", (data) => {
        this.wsServer?.broadcast({
          type: "device_disconnected",
          ...data,
          timestamp: new Date().toISOString(),
        });
      });

      // Make servers globally available
      global.iotdatahubServer = this.tcpServer;
      global.wsServer = this.wsServer;

      this.initialized = true;
      console.log("IoTDataHub servers initialized successfully");
    } catch (error) {
      console.error("Failed to initialize IoTDataHub servers:", error);
      throw error;
    }
  }

  getTCPServer() {
    return this.tcpServer;
  }

  getWSServer() {
    return this.wsServer;
  }
}

export const iotdatahubServerManager = new IoTDataHubServerManager();
