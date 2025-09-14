import type { ParsedCommand, DeviceInfo } from "./types";

function parseHardwareCommand(body: Buffer): ParsedCommand | null {
  const nullParts = body
    .toString("utf8")
    .split("\0")
    .filter((p) => p.length > 0);

  if (nullParts.length >= 3 && nullParts[0] === "vw") {
    const pin = parseInt(nullParts[1], 10);
    const value = nullParts[2];

    if (!isNaN(pin)) {
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
      return {
        type: "DIGITAL_WRITE",
        pin: pin,
        value: value,
      };
    }
  }

  // Fallback: Clean the command and try other methods
  const command = body.toString("utf8").replace(/\0/g, "").trim();

  // Fallback: Handle space or comma separated format
  const parts = command.split(/[\s,]+/).filter((p) => p.length > 0);

  if (parts.length >= 3 && parts[0] === "vw") {
    const pin = parseInt(parts[1], 10);
    const value = parts[2];

    if (!isNaN(pin)) {
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

    return {
      type: "DIGITAL_WRITE",
      pin: pin,
      value: value,
    };
  }

  return null;
}

function parseDeviceInfo(body: Buffer): DeviceInfo {
  const infoString = body.toString("utf8");

  const deviceInfo: DeviceInfo = {};

  // Parse null-byte separated key-value pairs
  const parts = infoString.split("\0").filter((part) => part.length > 0);

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

  return deviceInfo;
}

export { parseHardwareCommand, parseDeviceInfo };
