import net from "net";
import tls from "tls";
import fs from "fs";
import path from "path";
import type {
  IDeviceManager,
  IProtocolHandler,
  ServerComponents,
  SSLOptions,
} from "./types";
import config from "./config";
import logger from "./logger";
import handleDeviceConnection from "./connectionHandler";

function createTCPServer(
  deviceManager: IDeviceManager,
  protocolHandler: IProtocolHandler,
): ServerComponents {
  // Create TCP server for IoT devices
  const iotServer = net.createServer((socket) => {
    handleDeviceConnection(socket, deviceManager, protocolHandler);
  });

  // Create SSL TCP server if certificates exist
  let iotSSLServer: tls.Server | null = null;
  const sslCertPath = path.join(__dirname, "../../ssl/server.crt");
  const sslKeyPath = path.join(__dirname, "../../ssl/server.key");

  if (fs.existsSync(sslCertPath) && fs.existsSync(sslKeyPath)) {
    const sslOptions: SSLOptions = {
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

function startTCPServers(
  iotServer: net.Server,
  iotSSLServer: tls.Server | null,
): ServerComponents {
  // Start servers
  iotServer.listen(config.iotPort, (err?: Error) => {
    if (err) throw err;
    logger.info("TCP server started", { port: config.iotPort });
  });

  if (iotSSLServer) {
    iotSSLServer.listen(config.iotSSLPort, (err?: Error) => {
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

export { createTCPServer, startTCPServers };
