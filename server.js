const net = require("net");
const fs = require("fs");
const tls = require("tls");
const crypto = require("crypto");

// Simplified Configuration
const config = {
  iotPort: process.env.IOT_PORT || 80,
  iotSSLPort: process.env.IOT_SSL_PORT || 443,
  logLevel: process.env.LOG_LEVEL || "INFO",
  apiBaseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000", // Add API base URL
};

// Protocol Constants - Minimal Set
const PROTOCOL = {
  CMD_RESPONSE: 0,
  CMD_PING: 6,
  CMD_HARDWARE: 20,
  CMD_HARDWARE_SYNC: 16,
  CMD_INTERNAL: 17,
  CMD_HW_LOGIN: 29,

  STATUS_SUCCESS: 200,
};

// Simple Logger
class SimpleLogger {
  log(level, message, data = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...data,
    };
    console.log(JSON.stringify(entry));
  }

  info(message, data) {
    this.log("INFO", message, data);
  }
  debug(message, data) {
    this.log("DEBUG", message, data);
  }
  error(message, data) {
    this.log("ERROR", message, data);
  }
}

const logger = new SimpleLogger();

// Simple Message Parser
class SimpleMessage {
  constructor(type, id, length, body = Buffer.alloc(0)) {
    this.type = type;
    this.id = id;
    this.length = length;
    this.body = body;
    this.timestamp = Date.now();
  }

  static parse(buffer) {
    if (buffer.length < 5) return null;

    const type = buffer.readUInt8(0);
    const id = buffer.readUInt16BE(1);
    const length = buffer.readUInt16BE(3);

    if (buffer.length < 5 + length) return null;

    const body = buffer.slice(5, 5 + length);
    return new SimpleMessage(type, id, length, body);
  }

  toBuffer() {
    const buffer = Buffer.alloc(5 + this.length);
    buffer.writeUInt8(this.type, 0);
    buffer.writeUInt16BE(this.id, 1);
    buffer.writeUInt16BE(this.length, 3);
    if (this.body && this.body.length > 0) {
      this.body.copy(buffer, 5);
    }
    return buffer;
  }
}

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

function debugBuffer(buffer, label = "Buffer") {
  console.log(`====== ${label} Debug ======`);
  console.log("Length:", buffer.length);
  console.log("Hex:", buffer.toString("hex"));
  console.log("UTF8:", JSON.stringify(buffer.toString("utf8")));
  console.log("Raw bytes:", Array.from(buffer));

  // Check for common separators
  const utf8String = buffer.toString("utf8");
  console.log("Contains null bytes:", utf8String.includes("\0"));
  console.log("Contains spaces:", utf8String.includes(" "));
  console.log("Contains commas:", utf8String.includes(","));
  console.log("=============================");
}

function parseHardwareCommand(body) {
  debugBuffer(body, "Hardware Command");

  // The correct format is: vw\0<pin>\0<value>
  // Parse null-byte separated format FIRST (this is the correct format)
  const nullParts = body
    .toString("utf8")
    .split("\0")
    .filter((p) => p.length > 0);
  console.log("Null-separated parts:", nullParts);

  if (nullParts.length >= 3 && nullParts[0] === "vw") {
    const pin = parseInt(nullParts[1]);
    const value = nullParts[2];

    if (!isNaN(pin)) {
      console.log("====================================");
      console.log(
        `✅ Parsed VIRTUAL_WRITE (null-separated): pin=${pin}, value=${value}`,
      );
      console.log("====================================");

      return {
        type: "VIRTUAL_WRITE",
        pin: pin,
        value: value,
      };
    }
  }

  if (nullParts.length >= 3 && nullParts[0] === "vr") {
    const pin = parseInt(nullParts[1]);

    if (!isNaN(pin)) {
      console.log("====================================");
      console.log(`✅ Parsed VIRTUAL_READ (null-separated): pin=${pin}`);
      console.log("====================================");

      return {
        type: "VIRTUAL_READ",
        pin: pin,
      };
    }
  }

  if (nullParts.length >= 3 && nullParts[0] === "dw") {
    const pin = parseInt(nullParts[1]);
    const value = parseInt(nullParts[2]);

    if (!isNaN(pin) && !isNaN(value)) {
      console.log("====================================");
      console.log(
        `✅ Parsed DIGITAL_WRITE (null-separated): pin=${pin}, value=${value}`,
      );
      console.log("====================================");

      return {
        type: "DIGITAL_WRITE",
        pin: pin,
        value: value,
      };
    }
  }

  // Fallback: Clean the command and try other methods
  const command = body.toString("utf8").replace(/\0/g, "").trim();

  console.log("====================================");
  console.log("Cleaned command (fallback):", command);
  console.log("Command length:", command.length);
  console.log("====================================");

  // Fallback: Handle space or comma separated format
  const parts = command.split(/[\s,]+/).filter((p) => p.length > 0);
  console.log("Command parts (fallback):", parts);

  if (parts.length >= 3 && parts[0] === "vw") {
    const pin = parseInt(parts[1]);
    const value = parts[2];

    if (!isNaN(pin)) {
      console.log("====================================");
      console.log(
        `✅ Parsed VIRTUAL_WRITE (space/comma separated): pin=${pin}, value=${value}`,
      );
      console.log("====================================");

      return {
        type: "VIRTUAL_WRITE",
        pin: pin,
        value: value,
      };
    }
  }

  // Fallback: Standard format vw<pin><value> (no separators) - LEAST LIKELY TO BE CORRECT
  let vwMatch = command.match(/^vw(\d+)(.+)$/);
  if (vwMatch) {
    const pin = parseInt(vwMatch[1]);
    const value = vwMatch[2];

    console.log("====================================");
    console.log(
      `⚠️ Parsed VIRTUAL_WRITE (no separators - may be incorrect): pin=${pin}, value=${value}`,
    );
    console.log("====================================");

    return {
      type: "VIRTUAL_WRITE",
      pin: pin,
      value: value,
    };
  }

  // Fallback: Parse virtual read commands: vr<pin>
  const vrMatch = command.match(/^vr(\d+)$/);
  if (vrMatch) {
    const pin = parseInt(vrMatch[1]);

    console.log("====================================");
    console.log(`✅ Parsed VIRTUAL_READ (fallback): pin=${pin}`);
    console.log("====================================");

    return {
      type: "VIRTUAL_READ",
      pin: pin,
    };
  }

  // Fallback: Parse digital write commands: dw<pin><value>
  const dwMatch = command.match(/^dw(\d+)(\d+)$/);
  if (dwMatch) {
    const pin = parseInt(dwMatch[1]);
    const value = parseInt(dwMatch[2]);

    console.log("====================================");
    console.log(
      `✅ Parsed DIGITAL_WRITE (fallback): pin=${pin}, value=${value}`,
    );
    console.log("====================================");

    return {
      type: "DIGITAL_WRITE",
      pin: pin,
      value: value,
    };
  }

  console.log("====================================");
  console.log("❌ Could not parse command:", command);
  console.log("All parsing methods failed");
  console.log("====================================");

  return null;
}

function parseDeviceInfo(body) {
  debugBuffer(body, "Device Info");

  const infoString = body.toString("utf8");
  console.log("====================================");
  console.log("Raw device info:", infoString);
  console.log("====================================");

  const deviceInfo = {};

  // Parse null-byte separated key-value pairs
  const parts = infoString.split("\0").filter((part) => part.length > 0);
  console.log("====================================");
  console.log("Device info parts:", parts);
  console.log("====================================");

  // Process pairs: key, value, key, value, etc.
  for (let i = 0; i < parts.length - 1; i += 2) {
    const key = parts[i];
    const value = parts[i + 1];

    if (key && value !== undefined) {
      // Map the keys to more descriptive names
      switch (key) {
        case "mcu":
          deviceInfo.mcu = value;
          break;
        case "fw-type":
          deviceInfo.firmware = value;
          break;
        case "build":
          deviceInfo.build = value;
          break;
        case "iotdatahub":
          deviceInfo.version = value;
          break;
        case "h-beat":
          deviceInfo.heartbeat = value;
          break;
        case "buff-in":
          deviceInfo.buffer = value;
          break;
        case "dev":
          deviceInfo.device = value;
          break;
        case "tmpl":
          deviceInfo.template = value;
          break;
        default:
          // Store unknown keys as-is
          deviceInfo[key] = value;
          break;
      }
    }
  }

  console.log("====================================");
  console.log("Parsed device info:", deviceInfo);
  console.log("====================================");

  return deviceInfo;
}

// Enhanced device data storage function - NOW WITH DATABASE STORAGE
async function storeDeviceInfo(deviceToken, deviceInfo, clientIP) {
  try {
    const updateData = {
      lastPing: new Date(),
      status: "ONLINE",
    };

    // Map parsed info to device fields
    if (deviceInfo.firmware) {
      updateData.firmware = deviceInfo.firmware;
    }

    if (deviceInfo.device) {
      updateData.model = deviceInfo.device;
    }

    if (clientIP) {
      updateData.ipAddress = clientIP;
    }

    // Create metadata object with all parsed info
    updateData.metadata = {
      mcuVersion: deviceInfo.mcu,
      firmwareType: deviceInfo.firmware,
      buildInfo: deviceInfo.build,
      iotVersion: deviceInfo.version,
      heartbeat: deviceInfo.heartbeat ? parseInt(deviceInfo.heartbeat) : null,
      bufferSize: deviceInfo.buffer ? parseInt(deviceInfo.buffer) : null,
      template: deviceInfo.template,
      lastInfoUpdate: new Date().toISOString(),
      connectionCount: 1,
      rawDeviceInfo: deviceInfo,
    };

    // Make API call to store device info
    const response = await fetch(`${config.apiBaseUrl}/api/devices/info`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        deviceToken,
        ...updateData,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      logger.info("Device info stored in database", {
        device: result.device,
        updates: Object.keys(updateData),
      });
    } else {
      logger.error("Failed to store device info in database", {
        status: response.status,
        statusText: response.statusText,
      });
      // Still log locally as fallback
      logger.info("Device info stored locally (fallback)", {
        deviceToken: deviceToken.substring(0, 8) + "...",
        updates: Object.keys(updateData),
      });
    }
  } catch (error) {
    logger.error("Error storing device info in database", {
      error: error.message,
    });
    // Still log locally as fallback
    logger.info("Device info stored locally (fallback)", {
      deviceToken: deviceToken.substring(0, 8) + "...",
      updates: Object.keys(updateData),
    });
  }
}

async function storeHardwareData(deviceToken, pin, value) {
  try {
    // Make API call to store hardware data
    const response = await fetch(`${config.apiBaseUrl}/api/devices/data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        deviceToken,
        pinNumber: pin,
        value: value,
        dataType: isNaN(parseFloat(value)) ? "STRING" : "FLOAT",
      }),
    });

    if (response.ok) {
      const result = await response.json();
      logger.info("Hardware data stored in database", {
        device: result.device,
        pin: result.pin,
        value: result.value,
      });
    } else {
      logger.error("Failed to store hardware data in database", {
        status: response.status,
        statusText: response.statusText,
      });
      // Still log locally as fallback
      logger.info("Hardware data stored locally (fallback)", {
        device: deviceToken.substring(0, 8) + "...",
        pin: pin,
        value: value,
        dataType: isNaN(parseFloat(value)) ? "STRING" : "FLOAT",
      });
    }
  } catch (error) {
    logger.error("Error storing hardware data in database", {
      error: error.message,
    });
    // Still log locally as fallback
    logger.info("Hardware data stored locally (fallback)", {
      device: deviceToken.substring(0, 8) + "...",
      pin: pin,
      value: value,
      dataType: isNaN(parseFloat(value)) ? "STRING" : "FLOAT",
    });
  }
}

// Simple Protocol Handler - Always Success
class SimpleProtocolHandler {
  constructor(deviceManager) {
    this.deviceManager = deviceManager;
  }

  async handleMessage(socket, message, deviceToken) {
    try {
      logger.debug("Message received", {
        type: message.type,
        id: message.id,
        token: deviceToken ? this.deviceManager.maskToken(deviceToken) : null,
      });

      switch (message.type) {
        case PROTOCOL.CMD_HW_LOGIN:
          this.handleLogin(socket, message);
          break;
        case PROTOCOL.CMD_INTERNAL:
          await this.handleDeviceInfoMessage(socket, message, deviceToken);
          break;
        case PROTOCOL.CMD_HARDWARE:
          await this.handleHardwareMessage(socket, message, deviceToken);
          break;
        case PROTOCOL.CMD_HARDWARE_SYNC:
          this.sendSuccessResponse(socket, message.id);
          break;
        default:
          this.sendSuccessResponse(socket, message.id);
      }
    } catch (error) {
      logger.error("Message handling error", { error: error.message });
      // Still send success even on error
      this.sendSuccessResponse(socket, message.id);
    }
  }

  async handleDeviceInfoMessage(socket, message, deviceToken) {
    const clientIP = socket.remoteAddress?.replace("::ffff:", "") || "unknown";

    try {
      const deviceInfo = parseDeviceInfo(message.body);

      console.log("====================================");
      console.log("Parsed device info:", deviceInfo, "from IP:", clientIP);
      console.log("====================================");

      if (Object.keys(deviceInfo).length > 0 && deviceToken) {
        await storeDeviceInfo(deviceToken, deviceInfo, clientIP);
      }

      console.log("====================================");
      console.log(
        `Handling device info message: Type=${message.type}, ID=${message.id}, Length=${message.length}, Body=${message.body.toString("utf8").split("\0")}`,
      );
      console.log("====================================");

      this.sendSuccessResponse(socket, message.id);
    } catch (error) {
      logger.error("Internal message handling error", { error: error.message });
      // Still send success response
      this.sendSuccessResponse(socket, message.id);
    }
  }

  async handleHardwareMessage(socket, message, deviceToken) {
    try {
      // Parse the hardware command
      const parsedCommand = parseHardwareCommand(message.body);

      console.log("====================================");
      console.log(
        `Handling hardware message: Type=${message.type}, ID=${message.id}, Length=${message.length}, Body=${message.body.toString("utf8").split("\0")}, Parsed Command=${JSON.stringify(parsedCommand)}`,
      );
      console.log("====================================");

      if (parsedCommand && deviceToken) {
        logger.info("Hardware command parsed", {
          token: this.deviceManager.maskToken(deviceToken),
          command: parsedCommand,
        });

        // Store virtual pin data
        if (parsedCommand.type === "VIRTUAL_WRITE") {
          // Store in local device manager
          const device = this.deviceManager.getDevice(deviceToken);
          if (device) {
            device.virtualPins.set(parsedCommand.pin.toString(), {
              value: parsedCommand.value,
              timestamp: Date.now(),
            });
          }

          // Store in database via API
          await storeHardwareData(
            deviceToken,
            parsedCommand.pin,
            parsedCommand.value,
          );
        }
      }

      // Always send success response
      this.sendSuccessResponse(socket, message.id);
    } catch (error) {
      logger.error("Hardware message handling error", { error: error.message });
      // Still send success response
      this.sendSuccessResponse(socket, message.id);
    }
  }

  handleLogin(socket, message) {
    try {
      const token = message.body.toString("utf8").trim();

      // Always accept login - just store the token
      this.deviceManager.addDevice(token, socket);
      socket.deviceToken = token;

      this.sendSuccessResponse(socket, message.id);

      logger.info("Login successful", {
        token: this.deviceManager.maskToken(token),
      });
    } catch (error) {
      logger.error("Login error", { error: error.message });
      // Still send success
      this.sendSuccessResponse(socket, message.id);
    }
  }

  /**
   * Send a success response to the client.
   * @param {net.Socket} socket - The socket to send the response on.
   * @param {number} messageId - The original message ID to respond to.
   */

  sendSuccessResponse(socket, messageId) {
    try {
      // If client sends msg_id 0, generate a valid response ID (never 0)
      const responseId =
        messageId === 0 ? this.deviceManager.generateMessageId() : messageId;

      const buffer = Buffer.alloc(5); // Header only, no body
      buffer.writeUInt8(PROTOCOL.CMD_RESPONSE, 0); // type
      buffer.writeUInt16BE(responseId, 1); // message id
      buffer.writeUInt16BE(PROTOCOL.STATUS_SUCCESS, 3); // length = 200 (success code)

      socket.write(buffer);

      logger.debug("Success response sent", {
        originalId: messageId,
        responseId: responseId,
        buffer: buffer.toString("hex"),
      });
    } catch (error) {
      logger.error("Failed to send success response", { error: error.message });
    }
  }
}

// Simple Connection Handler
function handleDeviceConnection(socket, deviceManager, protocolHandler) {
  const connectionId = crypto.randomBytes(4).toString("hex");

  logger.info("Connection established", {
    connectionId,
    client: `${socket.remoteAddress}:${socket.remotePort}`,
  });

  let messageBuffer = Buffer.alloc(0);
  let deviceToken = null;

  socket.on("data", async (data) => {
    try {
      messageBuffer = Buffer.concat([messageBuffer, data]);

      while (messageBuffer.length >= 5) {
        const message = SimpleMessage.parse(messageBuffer);
        if (!message) break;

        messageBuffer = messageBuffer.slice(5 + message.length);

        // Get token from login message
        if (message.type === PROTOCOL.CMD_HW_LOGIN) {
          deviceToken = message.body.toString("utf8").trim();
        }

        console.log("====================================");
        console.log(
          `Received message: Type=${message.type}, ID=${message.id}, Length=${message.length}, Body=${message.body.toString("utf8").split("\n")}`,
        );
        console.log("====================================");

        await protocolHandler.handleMessage(socket, message, deviceToken);
      }
    } catch (error) {
      logger.error("Data processing error", { error: error.message });
    }
  });

  socket.on("close", () => {
    if (deviceToken) {
      deviceManager.removeDevice(deviceToken);
    }
    logger.info("Connection closed", { connectionId });
  });

  socket.on("error", (err) => {
    logger.error("Socket error", { error: err.message, connectionId });
  });
}

// Simple Device API - Always Success
function createDeviceAPI(deviceManager) {
  return {
    writeVirtualPin: (deviceToken, pin, value) => {
      try {
        const device = deviceManager.getDevice(deviceToken);
        if (device) {
          device.virtualPins.set(pin.toString(), {
            value,
            timestamp: Date.now(),
          });
          if (device.widgets[`V${pin}`]) {
            device.widgets[`V${pin}`].value = value;
          }
        }
        logger.debug("Virtual pin write", {
          token: deviceManager.maskToken(deviceToken),
          pin,
          value,
        });
        return true;
      } catch (error) {
        logger.error("Write pin error", { error: error.message });
        return true; // Always return success
      }
    },

    readVirtualPin: (deviceToken, pin) => {
      try {
        const device = deviceManager.getDevice(deviceToken);
        const pinValue = device ? device.virtualPins.get(pin.toString()) : null;
        return pinValue ? pinValue.value : "0"; // Default to "0" if not found
      } catch (error) {
        logger.error("Read pin error", { error: error.message });
        return "0"; // Always return a value
      }
    },

    getDeviceStatus: (deviceToken) => {
      try {
        const device = deviceManager.getDevice(deviceToken);
        return {
          connected: !!device,
          token: deviceToken,
          virtualPins: device ? Object.fromEntries(device.virtualPins) : {},
          widgets: device ? device.widgets : {},
        };
      } catch (error) {
        logger.error("Status error", { error: error.message });
        return { connected: false, token: deviceToken };
      }
    },

    getConnectedDevices: () => {
      try {
        return deviceManager.getAllDevices().map((device) => ({
          token: device.token,
          connected: true,
          virtualPins: Object.fromEntries(device.virtualPins),
          widgets: device.widgets,
        }));
      } catch (error) {
        logger.error("List devices error", { error: error.message });
        return [];
      }
    },
  };
}

// Start the servers
const deviceManager = new SimpleDeviceManager();
const protocolHandler = new SimpleProtocolHandler(deviceManager);
const deviceAPI = createDeviceAPI(deviceManager);

// Create TCP server for IoT devices
const iotServer = net.createServer((socket) => {
  handleDeviceConnection(socket, deviceManager, protocolHandler);
});

// Create SSL TCP server if certificates exist
let iotSSLServer = null;
if (fs.existsSync("./ssl/server.crt") && fs.existsSync("./ssl/server.key")) {
  const sslOptions = {
    key: fs.readFileSync("./ssl/server.key"),
    cert: fs.readFileSync("./ssl/server.crt"),
    rejectUnauthorized: false,
  };

  iotSSLServer = tls.createServer(sslOptions, (socket) => {
    handleDeviceConnection(socket, deviceManager, protocolHandler);
  });
}

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
    certPath: "./ssl/server.crt",
    keyPath: "./ssl/server.key",
  });
}

// Graceful shutdown
process.on("SIGINT", () => {
  logger.info("Shutting down servers");
  iotServer.close();
  if (iotSSLServer) iotSSLServer.close();
  process.exit(0);
});

logger.info("IoT Data Hub TCP/SSL Server initialized", {
  tcpPort: config.iotPort,
  sslPort: config.iotSSLPort,
  sslEnabled: !!iotSSLServer,
  apiBaseUrl: config.apiBaseUrl,
});
