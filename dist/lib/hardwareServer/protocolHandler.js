"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const message_1 = __importDefault(require("./message"));
const commandParser_1 = require("./commandParser");
const dataStorage_1 = require("./dataStorage");
const logger_1 = __importDefault(require("./logger"));
class SimpleProtocolHandler {
    constructor(deviceManager, wsManager, deviceCache) {
        this.deviceManager = deviceManager;
        this.wsManager = wsManager;
        this.deviceCache = deviceCache;
    }
    async handleMessage(socket, message, deviceToken) {
        try {
            logger_1.default.debug("Message received", {
                type: message.type,
                id: message.id,
                token: deviceToken ? this.deviceManager.maskToken(deviceToken) : null,
            });
            switch (message.type) {
                case types_1.PROTOCOL.CMD_HW_LOGIN:
                    await this.handleLogin(socket, message);
                    break;
                case types_1.PROTOCOL.CMD_INTERNAL:
                    await this.handleDeviceInfoMessage(socket, message, deviceToken);
                    break;
                case types_1.PROTOCOL.CMD_HARDWARE:
                    await this.handleHardwareMessage(socket, message, deviceToken);
                    break;
                case types_1.PROTOCOL.CMD_HARDWARE_SYNC:
                    this.sendSuccessResponse(socket, message.id, "Hardware sync acknowledged");
                    break;
                case types_1.PROTOCOL.CMD_PING:
                    this.sendSuccessResponse(socket, message.id, "Pong");
                    break;
                default:
                    this.sendSuccessResponse(socket, message.id, `Unknown message type ${message.type} handled`);
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            logger_1.default.error("Message handling error", { error: errorMessage });
            this.sendSuccessResponse(socket, message.id, `Error handled: ${errorMessage}`);
        }
    }
    async handleHardwareMessage(socket, message, deviceToken) {
        try {
            const parsedCommand = (0, commandParser_1.parseHardwareCommand)(message.body);
            if (parsedCommand && deviceToken) {
                logger_1.default.info("Hardware command parsed", {
                    token: this.deviceManager.maskToken(deviceToken),
                    command: parsedCommand,
                });
                // INSTANT WebSocket broadcast using cache (NO DATABASE DELAYS!)
                this.wsManager.broadcastHardwareUpdate(deviceToken, parsedCommand.pin, parsedCommand.value, parsedCommand.type);
                console.log("====================================");
                console.log("HARDWARE COMMAND EXECUTED");
                console.log(`   Device: ${this.deviceManager.maskToken(deviceToken)}`);
                console.log(`   Command: ${parsedCommand.type}`);
                console.log(`   Pin: ${parsedCommand.pin}`);
                if (parsedCommand.value !== undefined) {
                    console.log(`   Value: ${parsedCommand.value}`);
                }
                console.log("   Status: INSTANT CACHE UPDATE + DELAYED DB SAVE");
                console.log("====================================");
                // Store virtual pin data in device manager (for protocol compatibility)
                if (parsedCommand.type === "VIRTUAL_WRITE") {
                    const device = this.deviceManager.getDevice(deviceToken);
                    if (device) {
                        device.virtualPins.set(parsedCommand.pin.toString(), {
                            value: parsedCommand.value,
                            timestamp: Date.now(),
                        });
                    }
                    // Legacy database storage (will be handled by cache background process)
                    // Keep this for backward compatibility, but it won't block real-time updates
                    (0, dataStorage_1.storeHardwareData)(deviceToken, parsedCommand.pin, parsedCommand.value).catch((error) => {
                        logger_1.default.warn("Background database storage failed", { error });
                    });
                    this.sendSuccessResponse(socket, message.id, `VirtualWrite(${parsedCommand.pin}=${parsedCommand.value}) executed`);
                }
                else {
                    this.sendSuccessResponse(socket, message.id, `${parsedCommand.type} executed`);
                }
            }
            else {
                this.sendSuccessResponse(socket, message.id, "Hardware command processed");
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            logger_1.default.error("Hardware message handling error", { error: errorMessage });
            this.sendSuccessResponse(socket, message.id, "Hardware command processed (with errors)");
        }
    }
    async handleDeviceInfoMessage(socket, message, deviceToken) {
        const clientIP = socket.remoteAddress?.replace("::ffff:", "") || "unknown";
        try {
            const deviceInfo = (0, commandParser_1.parseDeviceInfo)(message.body);
            if (Object.keys(deviceInfo).length > 0 && deviceToken) {
                // Update cache immediately for instant status updates
                this.deviceCache.updateDeviceInfo(deviceToken, {
                    status: "ONLINE",
                    lastPing: new Date(),
                    metadata: {
                        mcuVersion: deviceInfo.mcu,
                        firmwareType: deviceInfo.firmware,
                        buildInfo: deviceInfo.build,
                        iotVersion: deviceInfo.version,
                        heartbeat: deviceInfo.heartbeat
                            ? parseInt(deviceInfo.heartbeat, 10)
                            : null,
                        bufferSize: deviceInfo.buffer
                            ? parseInt(deviceInfo.buffer, 10)
                            : null,
                        template: deviceInfo.template,
                        lastInfoUpdate: new Date().toISOString(),
                        connectionCount: 1,
                        rawDeviceInfo: deviceInfo,
                    },
                });
                // Legacy database storage (background, non-blocking)
                (0, dataStorage_1.storeDeviceInfo)(deviceToken, deviceInfo, clientIP).catch((error) => {
                    logger_1.default.warn("Background device info storage failed", { error });
                });
                // Broadcast device status update via WebSocket (instant)
                this.wsManager.broadcastDeviceStatus(deviceToken, "ONLINE", new Date());
            }
            const infoSummary = [];
            if (deviceInfo.firmware)
                infoSummary.push(`fw:${deviceInfo.firmware}`);
            if (deviceInfo.device)
                infoSummary.push(`device:${deviceInfo.device}`);
            if (deviceInfo.version)
                infoSummary.push(`ver:${deviceInfo.version}`);
            console.log("====================================");
            console.log("DEVICE INFO RECEIVED");
            console.log(`   Device: ${deviceToken ? this.deviceManager.maskToken(deviceToken) : "UNKNOWN"}`);
            console.log(`   IP: ${clientIP}`);
            console.log(`   Info: ${infoSummary.join(", ") || "No parsed info"}`);
            console.log("   Status: INSTANT CACHE UPDATE + DELAYED DB SAVE");
            console.log("====================================");
            this.sendSuccessResponse(socket, message.id, "Device info stored");
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            logger_1.default.error("Internal message handling error", { error: errorMessage });
            this.sendSuccessResponse(socket, message.id, "Device info processed (with errors)");
        }
    }
    async sendHardwareCommand(deviceToken, command, pin, value = null) {
        try {
            const device = this.deviceManager.getDevice(deviceToken);
            if (!device || !device.socket) {
                logger_1.default.error("Device not found or not connected", {
                    token: this.deviceManager.maskToken(deviceToken),
                });
                return false;
            }
            let bodyString;
            if (value !== null) {
                bodyString = `${command}\0${pin}\0${value}`;
            }
            else {
                bodyString = `${command}\0${pin}`;
            }
            const body = Buffer.from(bodyString, "utf8");
            const messageId = this.deviceManager.generateMessageId();
            const message = new message_1.default({
                type: types_1.PROTOCOL.CMD_HARDWARE,
                id: messageId,
                length: body.length,
                body,
            });
            const buffer = message.toBuffer();
            device.socket.write(buffer);
            const commandNames = {
                vw: "VirtualWrite",
                vr: "VirtualRead",
                dw: "DigitalWrite",
                dr: "DigitalRead",
            };
            const commandName = commandNames[command] || command.toUpperCase();
            console.log("====================================");
            console.log("SENDING COMMAND TO DEVICE");
            console.log(`   Device: ${this.deviceManager.maskToken(deviceToken)}`);
            console.log(`   Command: ${commandName}`);
            console.log(`   Pin: ${pin}`);
            if (value !== null) {
                console.log(`   Value: ${value}`);
            }
            console.log(`   Message ID: ${messageId}`);
            console.log("====================================");
            logger_1.default.info("Hardware command sent", {
                token: this.deviceManager.maskToken(deviceToken),
                command,
                pin,
                value,
                messageId,
                bodyHex: body.toString("hex"),
            });
            return true;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            logger_1.default.error("Failed to send hardware command", {
                error: errorMessage,
                token: this.deviceManager.maskToken(deviceToken),
            });
            return false;
        }
    }
    async sendVirtualWrite(deviceToken, pin, value) {
        console.log("====================================");
        console.log("SENDING VIRTUAL WRITE COMMAND TO DEVICE", deviceToken, "Pin", pin, "and Value", value);
        console.log("====================================");
        return await this.sendHardwareCommand(deviceToken, "vw", pin, value);
    }
    async sendVirtualRead(deviceToken, pin) {
        return await this.sendHardwareCommand(deviceToken, "vr", pin);
    }
    async sendDigitalWrite(deviceToken, pin, value) {
        return await this.sendHardwareCommand(deviceToken, "dw", pin, value);
    }
    async sendDigitalRead(deviceToken, pin) {
        return await this.sendHardwareCommand(deviceToken, "dr", pin);
    }
    async handleLogin(socket, message) {
        try {
            const token = message.body.toString("utf8").trim();
            this.deviceManager.addDevice(token, socket);
            socket.deviceToken = token;
            // Update device status in cache if device exists
            this.deviceCache.updateDeviceInfo(token, {
                status: "ONLINE",
                lastPing: new Date(),
            });
            console.log("====================================");
            console.log("DEVICE LOGIN SUCCESSFUL");
            console.log(`   Token: ${this.deviceManager.maskToken(token)}`);
            console.log(`   Client: ${socket.remoteAddress}:${socket.remotePort}`);
            console.log(`   Status: Authenticated and ready`);
            console.log(`   Cache Status: ${this.deviceCache.isReady() ? "Ready" : "Initializing"}`);
            console.log("====================================");
            this.sendSuccessResponse(socket, message.id, `Login successful for ${this.deviceManager.maskToken(token)}`);
            logger_1.default.info("Login successful", {
                token: this.deviceManager.maskToken(token),
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            logger_1.default.error("Login error", { error: errorMessage });
            this.sendSuccessResponse(socket, message.id, "Login processed (with errors)");
        }
    }
    sendSuccessResponse(socket, messageId, description = "Success") {
        try {
            const responseId = messageId === 0 ? this.deviceManager.generateMessageId() : messageId;
            const buffer = Buffer.alloc(5);
            buffer.writeUInt8(types_1.PROTOCOL.CMD_RESPONSE, 0);
            buffer.writeUInt16BE(responseId, 1);
            buffer.writeUInt16BE(types_1.PROTOCOL.STATUS_SUCCESS, 3);
            socket.write(buffer);
            console.log("====================================");
            console.log(`RESPONSE SENT: ${description}`);
            console.log(`   Message ID: ${responseId}`);
            console.log(`   Status: 200 (SUCCESS)`);
            console.log(`   Buffer: ${buffer.toString("hex")}`);
            console.log("====================================");
            logger_1.default.debug("Success response sent", {
                originalId: messageId,
                responseId: responseId,
                buffer: buffer.toString("hex"),
                description,
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            logger_1.default.error("Failed to send success response", { error: errorMessage });
        }
    }
}
exports.default = SimpleProtocolHandler;
