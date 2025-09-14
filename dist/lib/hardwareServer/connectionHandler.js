"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const types_1 = require("./types");
const message_1 = __importDefault(require("./message"));
const logger_1 = __importDefault(require("./logger"));
// Get meaningful message type name
function getMessageTypeName(type) {
    return types_1.MESSAGE_TYPES[type] || `UNKNOWN(${type})`;
}
// Format message body for display based on message type
function formatMessageBody(message) {
    const bodyStr = message.body.toString("utf8");
    switch (message.type) {
        case types_1.PROTOCOL.CMD_HW_LOGIN: {
            const token = bodyStr.trim();
            return `Token=${token.substring(0, 8)}...${token.substring(token.length - 4)}`;
        }
        case types_1.PROTOCOL.CMD_HARDWARE: {
            // Try to parse hardware command
            const nullParts = bodyStr.split("\0").filter((p) => p.length > 0);
            if (nullParts.length >= 2) {
                const command = nullParts[0];
                const pin = nullParts[1];
                const value = nullParts[2] || "";
                const commandNames = {
                    vw: "VirtualWrite",
                    vr: "VirtualRead",
                    dw: "DigitalWrite",
                    dr: "DigitalRead",
                };
                const commandName = commandNames[command] || command;
                return value
                    ? `${commandName}(pin=${pin}, value=${value})`
                    : `${commandName}(pin=${pin})`;
            }
            return `Raw=${bodyStr.replace(/\0/g, "\\0")}`;
        }
        case types_1.PROTOCOL.CMD_INTERNAL: {
            // Parse device info
            const parts = bodyStr.split("\0").filter((part) => part.length > 0);
            const infoItems = [];
            for (let i = 0; i < parts.length - 1; i += 2) {
                if (parts[i] && parts[i + 1]) {
                    infoItems.push(`${parts[i]}=${parts[i + 1]}`);
                }
            }
            return infoItems.length > 0 ? infoItems.join(", ") : "DeviceInfo";
        }
        default:
            return bodyStr.length > 50 ? `${bodyStr.substring(0, 47)}...` : bodyStr;
    }
}
function handleDeviceConnection(socket, deviceManager, protocolHandler) {
    const connectionId = crypto_1.default.randomBytes(4).toString("hex");
    const clientAddress = `${socket.remoteAddress}:${socket.remotePort}`;
    logger_1.default.info("Connection established", {
        connectionId,
        client: clientAddress,
    });
    let messageBuffer = Buffer.alloc(0);
    let deviceToken = null;
    const deviceInfo = {
        token: null,
        authenticated: false,
    };
    socket.on("data", async (data) => {
        try {
            messageBuffer = Buffer.concat([messageBuffer, data]);
            while (messageBuffer.length >= 5) {
                const message = message_1.default.parse(messageBuffer);
                if (!message)
                    break;
                messageBuffer = messageBuffer.slice(5 + message.length);
                // Get token from login message
                if (message.type === types_1.PROTOCOL.CMD_HW_LOGIN) {
                    deviceToken = message.body.toString("utf8").trim();
                    deviceInfo.token = deviceToken;
                    deviceInfo.authenticated = true;
                }
                // Handle the message
                await protocolHandler.handleMessage(socket, message, deviceToken);
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            logger_1.default.error("Data processing error", {
                error: errorMessage,
                connectionId,
                deviceToken: deviceToken ? deviceManager.maskToken(deviceToken) : null,
            });
        }
    });
    socket.on("close", () => {
        if (deviceToken) {
            deviceManager.removeDevice(deviceToken);
        }
        logger_1.default.info("Connection closed", {
            connectionId,
            deviceToken: deviceInfo.token,
        });
    });
    socket.on("error", (err) => {
        logger_1.default.error("Socket error", {
            error: err.message,
            connectionId,
            deviceToken: deviceInfo.token,
        });
    });
}
exports.default = handleDeviceConnection;
