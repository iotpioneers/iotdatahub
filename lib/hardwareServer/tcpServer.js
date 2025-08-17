const net = require("net");
const tls = require("tls");
const fs = require("fs");
const path = require("path");
const config = require("./config");
const logger = require("./logger");
const handleDeviceConnection = require("./connectionHandler");

function createTCPServer(deviceManager, protocolHandler) {
  // Create TCP server for IoT devices
  const iotServer = net.createServer((socket) => {
    handleDeviceConnection(socket, deviceManager, protocolHandler);
  });

  // Create SSL TCP server if certificates exist
  let iotSSLServer = null;
  const sslCertPath = path.join(__dirname, "../../ssl/server.crt");
  const sslKeyPath = path.join(__dirname, "../../ssl/server.key");

  if (fs.existsSync(sslCertPath) && fs.existsSync(sslKeyPath)) {
    const sslOptions = {
      key: fs.readFileSync(sslKeyPath),
      cert: fs.readFileSync(sslCertPath),
      rejectUnauthorized: false,
    };

    iotSSLServer = tls.createServer(sslOptions, (socket) => {
      handleDeviceConnection(socket, deviceManager, protocolHandler);
    });
  }

  return { iotServer, iotSSLServer };
}

function startTCPServers(iotServer, iotSSLServer) {
  // Start servers
  iotServer.listen(config.iotPort, (err) => {
    if (err) throw err;
    logger.info("TCP server started", { port: config.iotPort });
  });

  if (iotSSLServer) {
    iotSSLServer.listen(config.iotSSLPort, (err) => {
      if (err) throw err;
      logger.info("SSL server started", { port: config.iotSSLPort });
    });
  } else {
    logger.info("SSL server not started - certificates not found", {
      certPath: "../../ssl/server.crt",
      keyPath: "../../ssl/server.key",
    });
  }

  // Graceful shutdown
  process.on("SIGINT", () => {
    logger.info("Shutting down servers");
    iotServer.close();
    if (iotSSLServer) iotSSLServer.close();
    process.exit(0);
  });

  return { iotServer, iotSSLServer };
}

module.exports = {
  createTCPServer,
  startTCPServers,
};
