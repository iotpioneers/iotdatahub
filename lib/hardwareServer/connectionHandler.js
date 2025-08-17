const crypto = require("crypto");
const SimpleMessage = require("./message");
const { PROTOCOL } = require("./constants");
const logger = require("./logger");

// Message type descriptions for meaningful logging
const MESSAGE_TYPES = {
  [PROTOCOL.CMD_RESPONSE]: "RESPONSE",
  [PROTOCOL.CMD_PING]: "PING",
  [PROTOCOL.CMD_HARDWARE]: "HARDWARE_COMMAND",
  [PROTOCOL.CMD_HARDWARE_SYNC]: "HARDWARE_SYNC",
  [PROTOCOL.CMD_INTERNAL]: "DEVICE_INFO",
  [PROTOCOL.CMD_HW_LOGIN]: "LOGIN",
};

// Get meaningful message type name
function getMessageTypeName(type) {
  return MESSAGE_TYPES[type] || `UNKNOWN(${type})`;
}

// Format message body for display based on message type
function formatMessageBody(message) {
  const bodyStr = message.body.toString("utf8");

  switch (message.type) {
    case PROTOCOL.CMD_HW_LOGIN:
      const token = bodyStr.trim();
      return `Token=${token.substring(0, 8)}...${token.substring(token.length - 4)}`;

    case PROTOCOL.CMD_HARDWARE:
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

    case PROTOCOL.CMD_INTERNAL:
      // Parse device info
      const parts = bodyStr.split("\0").filter((part) => part.length > 0);
      const infoItems = [];
      for (let i = 0; i < parts.length - 1; i += 2) {
        if (parts[i] && parts[i + 1]) {
          infoItems.push(`${parts[i]}=${parts[i + 1]}`);
        }
      }
      return infoItems.length > 0 ? infoItems.join(", ") : "DeviceInfo";

    default:
      return bodyStr.length > 50 ? `${bodyStr.substring(0, 47)}...` : bodyStr;
  }
}

// Simple Connection Handler with Enhanced Logging
function handleDeviceConnection(socket, deviceManager, protocolHandler) {
  const connectionId = crypto.randomBytes(4).toString("hex");
  const clientAddress = `${socket.remoteAddress}:${socket.remotePort}`;

  logger.info("Connection established", {
    connectionId,
    client: clientAddress,
  });

  console.log("====================================");
  console.log(`🔌 NEW CONNECTION: ${clientAddress} (ID: ${connectionId})`);
  console.log("====================================");

  let messageBuffer = Buffer.alloc(0);
  let deviceToken = null;
  let deviceInfo = { token: null, authenticated: false };

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
          deviceInfo.token = deviceToken;
          deviceInfo.authenticated = true;
        }

        // Enhanced message logging
        const messageTypeName = getMessageTypeName(message.type);
        const formattedBody = formatMessageBody(message);
        const maskedToken = deviceToken
          ? `${deviceToken.substring(0, 4)}...${deviceToken.substring(deviceToken.length - 4)}`
          : "NOT_AUTHENTICATED";

        console.log("====================================");
        console.log(`📨 RECEIVED: ${messageTypeName}`);
        console.log(`   Connection: ${connectionId} (${clientAddress})`);
        console.log(`   Device: ${maskedToken}`);
        console.log(`   Message ID: ${message.id}`);
        console.log(`   Length: ${message.length} bytes`);
        console.log(`   Content: ${formattedBody}`);
        console.log("====================================");

        // Handle the message
        await protocolHandler.handleMessage(socket, message, deviceToken);
      }
    } catch (error) {
      logger.error("Data processing error", {
        error: error.message,
        connectionId,
        deviceToken: deviceToken ? deviceManager.maskToken(deviceToken) : null,
      });

      console.log("====================================");
      console.log(`❌ ERROR processing message from ${connectionId}`);
      console.log(`   Error: ${error.message}`);
      console.log("====================================");
    }
  });

  socket.on("close", () => {
    if (deviceToken) {
      deviceManager.removeDevice(deviceToken);
    }

    logger.info("Connection closed", {
      connectionId,
      deviceToken: deviceInfo.token,
    });

    console.log("====================================");
    console.log(`🔌 CONNECTION CLOSED: ${clientAddress} (ID: ${connectionId})`);
    console.log(
      `   Device: ${deviceInfo.token ? deviceManager.maskToken(deviceInfo.token) : "NOT_AUTHENTICATED"}`,
    );
    console.log(`   Duration: Connection closed gracefully`);
    console.log("====================================");
  });

  socket.on("error", (err) => {
    logger.error("Socket error", {
      error: err.message,
      connectionId,
      deviceToken: deviceInfo.token,
    });

    console.log("====================================");
    console.log(`❌ SOCKET ERROR: ${clientAddress} (ID: ${connectionId})`);
    console.log(`   Error: ${err.message}`);
    console.log(
      `   Device: ${deviceInfo.token ? deviceManager.maskToken(deviceInfo.token) : "NOT_AUTHENTICATED"}`,
    );
    console.log("====================================");
  });
}

module.exports = handleDeviceConnection;
