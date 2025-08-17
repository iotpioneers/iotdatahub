const logger = require("./logger");

// Simple Device Manager - Token Only
class SimpleDeviceManager {
  constructor() {
    this.devices = new Map(); // Just store tokens
    this.messageIdCounter = 1;
  }

  addDevice(token, socket) {
    this.devices.set(token, {
      token,
      socket,
      virtualPins: new Map(),
      widgets: {},
      connectTime: Date.now(),
    });
    logger.info("Device connected", { token: this.maskToken(token) });
  }

  getDevice(token) {
    return this.devices.get(token);
  }

  removeDevice(token) {
    this.devices.delete(token);
    logger.info("Device disconnected", { token: this.maskToken(token) });
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
module.exports = SimpleDeviceManager;
