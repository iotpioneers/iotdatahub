"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTCPServer = createTCPServer;
exports.startTCPServers = startTCPServers;
const net_1 = __importDefault(require("net"));
const tls_1 = __importDefault(require("tls"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("./config"));
const logger_1 = __importDefault(require("./logger"));
const connectionHandler_1 = __importDefault(require("./connectionHandler"));
function createTCPServer(deviceManager, protocolHandler) {
    // Create TCP server for IoT devices
    const iotServer = net_1.default.createServer((socket) => {
        (0, connectionHandler_1.default)(socket, deviceManager, protocolHandler);
    });
    // Create SSL TCP server if certificates exist
    let iotSSLServer = null;
    const sslCertPath = path_1.default.join(__dirname, "../../ssl/server.crt");
    const sslKeyPath = path_1.default.join(__dirname, "../../ssl/server.key");
    if (fs_1.default.existsSync(sslCertPath) && fs_1.default.existsSync(sslKeyPath)) {
        const sslOptions = {
            key: fs_1.default.readFileSync(sslKeyPath),
            cert: fs_1.default.readFileSync(sslCertPath),
            rejectUnauthorized: false,
        };
        iotSSLServer = tls_1.default.createServer(sslOptions, (socket) => {
            (0, connectionHandler_1.default)(socket, deviceManager, protocolHandler);
        });
    }
    return { iotServer, iotSSLServer };
}
function startTCPServers(iotServer, iotSSLServer) {
    // Start servers
    iotServer.listen(config_1.default.iotPort, (err) => {
        if (err)
            throw err;
        logger_1.default.info("TCP server started", { port: config_1.default.iotPort });
    });
    if (iotSSLServer) {
        iotSSLServer.listen(config_1.default.iotSSLPort, (err) => {
            if (err)
                throw err;
            logger_1.default.info("SSL server started", { port: config_1.default.iotSSLPort });
        });
    }
    else {
        logger_1.default.info("SSL server not started - certificates not found", {
            certPath: "../../ssl/server.crt",
            keyPath: "../../ssl/server.key",
        });
    }
    // Graceful shutdown
    process.on("SIGINT", () => {
        logger_1.default.info("Shutting down servers");
        iotServer.close();
        if (iotSSLServer)
            iotSSLServer.close();
        process.exit(0);
    });
    return { iotServer, iotSSLServer };
}
