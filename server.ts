// Core components
import SimpleDeviceManager from "./lib/hardwareServer/deviceManager";
import SimpleProtocolHandler from "./lib/hardwareServer/protocolHandler";

// Servers
import {
  createTCPServer,
  startTCPServers,
} from "./lib/hardwareServer/tcpServer";
import {
  createAPIServer,
  startAPIServer,
} from "./lib/hardwareServer/apiServer";

// Initialize core components
const deviceManager = new SimpleDeviceManager();
const protocolHandler = new SimpleProtocolHandler(deviceManager);

// Create servers
const { iotServer, iotSSLServer } = createTCPServer(
  deviceManager,
  protocolHandler,
);
const apiApp = createAPIServer(deviceManager, protocolHandler);

// Start all servers
startTCPServers(iotServer, iotSSLServer);
startAPIServer(apiApp);
