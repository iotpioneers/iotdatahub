import type {
  DeviceInfo,
  DeviceUpdateData,
  HardwareDataRequest,
} from "./types";
import logger from "./logger";
import prisma from "../../prisma/client";

async function storeDeviceInfo(
  deviceToken: string,
  deviceInfo: DeviceInfo,
  clientIP: string,
): Promise<void> {
  try {
    // Find the device by auth token
    const device = await prisma.device.findUnique({
      where: { authToken: deviceToken },
    });

    if (!device) {
      logger.warn("Device not found for info update", {
        token: deviceToken.substring(0, 8) + "...",
      });
      return;
    }

    // Determine device type based on model
    const deviceType = deviceInfo.device?.startsWith("ESP")
      ? "GATEWAY"
      : deviceInfo.device?.startsWith("ARDUINO")
        ? "CONTROLLER"
        : device.deviceType;

    // Update device with new information
    const updatedDevice = await prisma.device.update({
      where: { id: device.id },
      data: {
        firmware: deviceInfo.firmware || device.firmware,
        model: deviceInfo.device || device.model,
        ipAddress: clientIP || device.ipAddress,
        deviceType: deviceType,
        metadata: deviceInfo
          ? {
              ...((device.metadata as object) || {}),
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
            }
          : device.metadata,
        lastPing: new Date(),
        status: "ONLINE",
      },
    });

    // Log the device info update
    await prisma.deviceLog.create({
      data: {
        deviceId: device.id,
        level: "INFO",
        message: "Device information updated via socket connection",
        data: {
          updatedFields: {
            firmware: !!deviceInfo.firmware,
            model: !!deviceInfo.device,
            ipAddress: !!clientIP,
            metadata: !!deviceInfo,
          },
          source: "socket_connection",
        },
      },
    });

    logger.info("Device info stored in database", {
      device: updatedDevice.name,
      deviceId: updatedDevice.id,
      updates: Object.keys(deviceInfo),
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logger.error("Error storing device info in database", {
      error: errorMessage,
    });
  }
}

async function storeHardwareData(
  deviceToken: string,
  pin: number,
  value: string | number,
): Promise<void> {
  try {
    // Find the device by auth token
    const device = await prisma.device.findUnique({
      where: { authToken: deviceToken },
    });

    if (!device) {
      logger.warn("Device not found for hardware data", {
        token: deviceToken.substring(0, 8) + "...",
        pin,
        value,
      });
      return;
    }

    // Update device status to ONLINE since we're receiving data
    await prisma.device.update({
      where: { id: device.id },
      data: {
        status: "ONLINE",
        lastPing: new Date(),
      },
    });

    const dataType = isNaN(parseFloat(String(value))) ? "STRING" : "FLOAT";

    // Upsert virtual pin data
    await prisma.virtualPin.upsert({
      where: {
        deviceId_pinNumber: {
          deviceId: device.id,
          pinNumber: pin,
        },
      },
      update: {
        value: value.toString(),
        dataType: dataType,
        lastUpdated: new Date(),
      },
      create: {
        deviceId: device.id,
        pinNumber: pin,
        value: value.toString(),
        dataType: dataType,
        lastUpdated: new Date(),
      },
    });

    // Store in pin history for analytics
    await prisma.pinHistory.create({
      data: {
        deviceId: device.id,
        pinNumber: pin,
        value: value.toString(),
        dataType: dataType,
        timestamp: new Date(),
      },
    });

    // Update widgets that use this pin
    const widgets = await prisma.widget.findMany({
      where: {
        deviceId: device.id,
        pinNumber: pin,
      },
    });

    for (const widget of widgets) {
      await prisma.widget.update({
        where: { id: widget.id },
        data: {
          value: value.toString(),
          updatedAt: new Date(),
        },
      });
    }

    logger.info("Hardware data stored in database", {
      device: device.name,
      deviceId: device.id,
      pin,
      value,
      dataType,
      widgetUpdates: widgets.length,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logger.error("Error storing hardware data in database", {
      error: errorMessage,
    });
  }
}

export { storeDeviceInfo, storeHardwareData };
