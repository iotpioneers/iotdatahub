import crypto from "crypto";
import type {
  DeviceSocket,
  IDeviceManager,
  IProtocolHandler,
  ParsedMessage,
  DeviceConnectionInfo,
  ConnectionId,
  ClientAddress,
} from "./types";
import { MESSAGE_TYPES, PROTOCOL } from "./types";
import SimpleMessage from "./message";
import logger from "./logger";

// Get meaningful message type name
function getMessageTypeName(type: number): string {
  return MESSAGE_TYPES[type] || `UNKNOWN(${type})`;
}

// Format message body for display based on message type
function formatMessageBody(message: ParsedMessage): string {
  const bodyStr = message.body.toString("utf8");

  switch (message.type) {
    case PROTOCOL.CMD_HW_LOGIN: {
      const token = bodyStr.trim();
      return `Token=${token.substring(0, 8)}...${token.substring(token.length - 4)}`;
    }

    case PROTOCOL.CMD_HARDWARE: {
      // Try to parse hardware command
      const nullParts = bodyStr.split("\0").filter((p) => p.length > 0);
      if (nullParts.length >= 2) {
        const command = nullParts[0];
        const pin = nullParts[1];
        const value = nullParts[2] || "";

        const commandNames: Record<string, string> = {
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

    case PROTOCOL.CMD_INTERNAL: {
      // Parse device info
      const parts = bodyStr.split("\0").filter((part) => part.length > 0);
      const infoItems: string[] = [];
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

function handleDeviceConnection(
  socket: DeviceSocket,
  deviceManager: IDeviceManager,
  protocolHandler: IProtocolHandler,
): void {
  const connectionId: ConnectionId = crypto.randomBytes(4).toString("hex");
  const clientAddress: ClientAddress = `${socket.remoteAddress}:${socket.remotePort}`;

  logger.info("Connection established", {
    connectionId,
    client: clientAddress,
  });

  let messageBuffer = Buffer.alloc(0);
  let deviceToken: string | null = null;
  const deviceInfo: DeviceConnectionInfo = {
    token: null,
    authenticated: false,
  };

  socket.on("data", async (data: Buffer) => {
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

        // Handle the message
        await protocolHandler.handleMessage(socket, message, deviceToken);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error("Data processing error", {
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

    logger.info("Connection closed", {
      connectionId,
      deviceToken: deviceInfo.token,
    });
  });

  socket.on("error", (err: Error) => {
    logger.error("Socket error", {
      error: err.message,
      connectionId,
      deviceToken: deviceInfo.token,
    });
  });
}

export default handleDeviceConnection;
