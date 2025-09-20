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
import { createAPIServer } from "./lib/hardwareServer/apiServer";

import config from "./lib/hardwareServer/config";
import logger from "./lib/hardwareServer/logger";

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
const apiApp = createAPIServer(deviceManager, protocolHandler, deviceCache);

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

// FIXED: Start HTTP server with WebSocket support (for dashboard) - bind to all interfaces
httpServer.listen(config.apiPort, "0.0.0.0", () => {
  logger.info(`
====================================
🚀 Enhanced Hardware Command API + WebSocket Server running on port ${config.apiPort}
📡 WebSocket endpoint: ws://0.0.0.0:${config.apiPort}/api/ws
📱 TCP IoT Server running on port ${config.iotPort} (all interfaces)
====================================
`);
});

// Graceful shutdown with cache cleanup
process.on("SIGINT", async () => {
  // Clean up cache first
  deviceCache.cleanup();
  wsManager.cleanup();

  httpServer.close();
  iotServer.close();
  if (iotSSLServer) iotSSLServer.close();

  process.exit(0);
});

process.on("SIGTERM", async () => {
  deviceCache.cleanup();
  wsManager.cleanup();

  httpServer.close(() => {
    process.exit(0);
  });
});
