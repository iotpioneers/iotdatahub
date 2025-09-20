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
  const sslCertPath = path.join(process.cwd(), "ssl", "server.crt");
  const sslKeyPath = path.join(process.cwd(), "ssl", "server.key");

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
  // FIXED: Bind to all interfaces (0.0.0.0) instead of localhost
  iotServer.listen(config.iotPort, "0.0.0.0", (err?: Error) => {
    if (err) throw err;
    logger.info("TCP server started on all interfaces", {
      port: config.iotPort,
      host: "0.0.0.0",
    });
  });

  if (iotSSLServer) {
    iotSSLServer.listen(config.iotSSLPort, "0.0.0.0", (err?: Error) => {
      if (err) throw err;
      logger.info("SSL server started on all interfaces", {
        port: config.iotSSLPort,
        host: "0.0.0.0",
      });
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
