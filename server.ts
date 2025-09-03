import http from "http";

// Core components
import SimpleDeviceManager from "./lib/hardwareServer/deviceManager";
import SimpleProtocolHandler from "./lib/hardwareServer/protocolHandler";
import WebSocketManager from "./lib/hardwareServer/websocketManager";
import DeviceCacheManager from "./lib/hardwareServer/deviceCacheManager";

// Servers
import {
  createTCPServer,
  startTCPServers,
} from "./lib/hardwareServer/tcpServer";
import {
  createAPIServer,
  startAPIServer,
} from "./lib/hardwareServer/apiServer";

import config from "./lib/hardwareServer/config";

// Initialize core components in proper order
const deviceCache = new DeviceCacheManager();
const deviceManager = new SimpleDeviceManager();
const wsManager = new WebSocketManager(deviceCache); // Pass cache to WebSocket manager
const protocolHandler = new SimpleProtocolHandler(
  deviceManager,
  wsManager,
  deviceCache,
);

// Create API server first (Express app)
const apiApp = createAPIServer(deviceManager, protocolHandler);

// Create HTTP server from Express app
const httpServer = http.createServer(apiApp);

// Initialize WebSocket server with the HTTP server
wsManager.initialize(httpServer);

// Create TCP servers for IoT devices
const { iotServer, iotSSLServer } = createTCPServer(
  deviceManager,
  protocolHandler,
);

// Start TCP servers (for IoT devices)
startTCPServers(iotServer, iotSSLServer);

// Start HTTP server with WebSocket support (for dashboard)
httpServer.listen(config.apiPort, () => {
  console.log(`
====================================
🚀 Enhanced Hardware Command API + WebSocket Server running on port ${config.apiPort}
📡 WebSocket endpoint: ws://localhost:${config.apiPort}/api/ws
📱 TCP IoT Server running on port ${config.iotPort}
====================================
`);
});

// Graceful shutdown with cache cleanup
process.on("SIGINT", async () => {
  console.log("Shutting down all servers and cleaning up cache...");

  // Clean up cache first
  deviceCache.cleanup();
  wsManager.cleanup();

  httpServer.close();
  iotServer.close();
  if (iotSSLServer) iotSSLServer.close();

  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Received SIGTERM, shutting down gracefully...");

  deviceCache.cleanup();
  wsManager.cleanup();

  httpServer.close(() => {
    process.exit(0);
  });
});
