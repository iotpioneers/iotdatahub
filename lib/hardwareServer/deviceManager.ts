import type {
  IDeviceManager,
  Device,
  DeviceSocket,
  MaskedToken,
} from "./types";
import logger from "./logger";

class SimpleDeviceManager implements IDeviceManager {
  private readonly devices = new Map<string, Device>();
  private messageIdCounter = 1;

  addDevice(token: string, socket: DeviceSocket): void {
    const device: Device = {
      token,
      socket,
      virtualPins: new Map(),
      widgets: {},
      connectTime: Date.now(),
    };

    this.devices.set(token, device);
    logger.info("Device connected", { token: this.maskToken(token) });
  }

  getDevice(token: string): Device | undefined {
    return this.devices.get(token);
  }

  removeDevice(token: string): void {
    this.devices.delete(token);
    logger.info("Device disconnected", { token: this.maskToken(token) });
  }

  getAllDevices(): Device[] {
    return Array.from(this.devices.values());
  }

  generateMessageId(): number {
    this.messageIdCounter = (this.messageIdCounter % 65535) + 1;
    return this.messageIdCounter;
  }

  maskToken(token: string): MaskedToken {
    return token
      ? `${token.substring(0, 3)}...${token.substring(token.length - 3)}`
      : "****";
  }
}

export default SimpleDeviceManager;
