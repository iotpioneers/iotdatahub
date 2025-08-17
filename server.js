const config = require("./lib/hardwareServer/config");
const logger = require("./lib/hardwareServer/logger");

// Core components
const SimpleDeviceManager = require("./lib/hardwareServer/deviceManager");
const SimpleProtocolHandler = require("./lib/hardwareServer/protocolHandler");
const createDeviceAPI = require("./lib/hardwareServer/deviceAPI");

// Servers
const {
  createTCPServer,
  startTCPServers,
} = require("./lib/hardwareServer/tcpServer");
const {
  createAPIServer,
  startAPIServer,
} = require("./lib/hardwareServer/apiServer");

// Initialize core components
const deviceManager = new SimpleDeviceManager();
const protocolHandler = new SimpleProtocolHandler(deviceManager);
const deviceAPI = createDeviceAPI(deviceManager);

// Create servers
const { iotServer, iotSSLServer } = createTCPServer(
  deviceManager,
  protocolHandler,
);
const apiApp = createAPIServer(deviceManager, protocolHandler);

// Start all servers
startTCPServers(iotServer, iotSSLServer);
startAPIServer(apiApp);

// Log initialization
logger.info("IoT Data Hub TCP/SSL Server initialized", {
  tcpPort: config.iotPort,
  sslPort: config.iotSSLPort,
  apiPort: config.apiPort,
  sslEnabled: !!iotSSLServer,
  apiBaseUrl: config.apiBaseUrl,
});
