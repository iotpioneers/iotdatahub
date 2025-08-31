"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./logger"));
class SimpleDeviceManager {
    constructor() {
        this.devices = new Map();
        this.messageIdCounter = 1;
    }
    addDevice(token, socket) {
        const device = {
            token,
            socket,
            virtualPins: new Map(),
            widgets: {},
            connectTime: Date.now(),
        };
        this.devices.set(token, device);
        logger_1.default.info("Device connected", { token: this.maskToken(token) });
    }
    getDevice(token) {
        return this.devices.get(token);
    }
    removeDevice(token) {
        this.devices.delete(token);
        logger_1.default.info("Device disconnected", { token: this.maskToken(token) });
    }
    getAllDevices() {
        return Array.from(this.devices.values());
    }
    generateMessageId() {
        this.messageIdCounter = (this.messageIdCounter % 65535) + 1;
        return this.messageIdCounter;
    }
    maskToken(token) {
        return token
            ? `${token.substring(0, 3)}...${token.substring(token.length - 3)}`
            : "****";
    }
}
exports.default = SimpleDeviceManager;
