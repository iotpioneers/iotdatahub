"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
// Core components
const deviceManager_1 = __importDefault(require("./lib/hardwareServer/deviceManager"));
const protocolHandler_1 = __importDefault(require("./lib/hardwareServer/protocolHandler"));
const websocketManager_1 = __importDefault(require("./lib/hardwareServer/websocketManager"));
const deviceCacheManager_1 = __importDefault(require("./lib/hardwareServer/deviceCacheManager"));
// Servers
const tcpServer_1 = require("./lib/hardwareServer/tcpServer");
const apiServer_1 = require("./lib/hardwareServer/apiServer");
const config_1 = __importDefault(require("./lib/hardwareServer/config"));
const logger_1 = __importDefault(require("./lib/hardwareServer/logger"));
// Initialize core components in proper order
const deviceCache = new deviceCacheManager_1.default();
const deviceManager = new deviceManager_1.default();
const wsManager = new websocketManager_1.default(deviceCache); // Pass cache to WebSocket manager
const protocolHandler = new protocolHandler_1.default(deviceManager, wsManager, deviceCache);
// Create API server first (Express app)
const apiApp = (0, apiServer_1.createAPIServer)(deviceManager, protocolHandler, deviceCache);
// Create HTTP server from Express app
const httpServer = http_1.default.createServer(apiApp);
// Initialize WebSocket server with the HTTP server
wsManager.initialize(httpServer);
// Create TCP servers for IoT devices
const { iotServer, iotSSLServer } = (0, tcpServer_1.createTCPServer)(deviceManager, protocolHandler);
// Start TCP servers (for IoT devices)
(0, tcpServer_1.startTCPServers)(iotServer, iotSSLServer);
// FIXED: Start HTTP server with WebSocket support (for dashboard) - bind to all interfaces
httpServer.listen(config_1.default.apiPort, "0.0.0.0", () => {
    logger_1.default.info(`
====================================
🚀 Enhanced Hardware Command API + WebSocket Server running on port ${config_1.default.apiPort}
📡 WebSocket endpoint: ws://0.0.0.0:${config_1.default.apiPort}/api/ws
📱 TCP IoT Server running on port ${config_1.default.iotPort} (all interfaces)
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
    if (iotSSLServer)
        iotSSLServer.close();
    process.exit(0);
});
process.on("SIGTERM", async () => {
    deviceCache.cleanup();
    wsManager.cleanup();
    httpServer.close(() => {
        process.exit(0);
    });
});
