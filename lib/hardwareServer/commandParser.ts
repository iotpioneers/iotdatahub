import type { ParsedCommand, DeviceInfo } from "./types";

function debugBuffer(buffer: Buffer, label = "Buffer"): void {
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

function parseHardwareCommand(body: Buffer): ParsedCommand | null {
  debugBuffer(body, "Hardware Command");

  // The correct format is: vw\0<pin>\0<value>
  // Parse null-byte separated format FIRST (this is the correct format)
  const nullParts = body
    .toString("utf8")
    .split("\0")
    .filter((p) => p.length > 0);
  console.log("Null-separated parts:", nullParts);

  if (nullParts.length >= 3 && nullParts[0] === "vw") {
    const pin = parseInt(nullParts[1], 10);
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
    const pin = parseInt(nullParts[1], 10);

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
    const pin = parseInt(nullParts[1], 10);
    const value = parseInt(nullParts[2], 10);

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
    const pin = parseInt(parts[1], 10);
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
  const vwMatch = command.match(/^vw(\d+)(.+)$/);
  if (vwMatch) {
    const pin = parseInt(vwMatch[1], 10);
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
    const pin = parseInt(vrMatch[1], 10);

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
    const pin = parseInt(dwMatch[1], 10);
    const value = parseInt(dwMatch[2], 10);

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

function parseDeviceInfo(body: Buffer): DeviceInfo {
  debugBuffer(body, "Device Info");

  const infoString = body.toString("utf8");
  console.log("====================================");
  console.log("Raw device info:", infoString);
  console.log("====================================");

  const deviceInfo: DeviceInfo = {};

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

export { parseHardwareCommand, parseDeviceInfo, debugBuffer };
