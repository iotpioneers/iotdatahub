import http from "http";

// Core components
import SimpleDeviceManager from "./lib/hardwareServer/deviceManager";
import SimpleProtocolHandler from "./lib/hardwareServer/protocolHandler";
import WebSocketManager from "./lib/hardwareServer/websocketManager";

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

// Initialize core components
const deviceManager = new SimpleDeviceManager();
const wsManager = new WebSocketManager();
const protocolHandler = new SimpleProtocolHandler(deviceManager, wsManager);

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
🚀 Hardware Command API + WebSocket Server running on port ${config.apiPort}
📡 WebSocket endpoint: ws://localhost:${config.apiPort}/api/ws
🔌 TCP IoT Server running on port ${config.iotPort}
====================================
`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down all servers...");

  httpServer.close();
  iotServer.close();
  if (iotSSLServer) iotSSLServer.close();

  process.exit(0);
});
