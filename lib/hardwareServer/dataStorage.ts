import type {
  DeviceInfo,
  DeviceUpdateData,
  HardwareDataRequest,
} from "./types";
import config from "./config";
import logger from "./logger";

interface APIDeviceInfoResponse {
  device: string;
}

interface APIHardwareDataResponse {
  device: string;
  pin: number;
  value: string | number;
}

async function storeDeviceInfo(
  deviceToken: string,
  deviceInfo: DeviceInfo,
  clientIP: string,
): Promise<void> {
  try {
    const updateData: DeviceUpdateData = {
      lastPing: new Date(),
      status: "ONLINE",
      metadata: {
        mcuVersion: deviceInfo.mcu,
        firmwareType: deviceInfo.firmware,
        buildInfo: deviceInfo.build,
        iotVersion: deviceInfo.version,
        heartbeat: deviceInfo.heartbeat
          ? parseInt(deviceInfo.heartbeat, 10)
          : null,
        bufferSize: deviceInfo.buffer ? parseInt(deviceInfo.buffer, 10) : null,
        template: deviceInfo.template,
        lastInfoUpdate: new Date().toISOString(),
        connectionCount: 1,
        rawDeviceInfo: deviceInfo,
      },
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
      const result = (await response.json()) as APIDeviceInfoResponse;
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
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logger.error("Error storing device info in database", {
      error: errorMessage,
    });
    // Still log locally as fallback
    logger.info("Device info stored locally (fallback)", {
      deviceToken: deviceToken.substring(0, 8) + "...",
      updates: ["lastPing", "status"],
    });
  }
}

async function storeHardwareData(
  deviceToken: string,
  pin: number,
  value: string | number,
): Promise<void> {
  try {
    const dataRequest: HardwareDataRequest = {
      deviceToken,
      pinNumber: pin,
      value: value,
      dataType: isNaN(parseFloat(String(value))) ? "STRING" : "FLOAT",
    };

    // Make API call to store hardware data
    const response = await fetch(`${config.apiBaseUrl}/api/devices/data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataRequest),
    });

    if (response.ok) {
      const result = (await response.json()) as APIHardwareDataResponse;
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
        dataType: dataRequest.dataType,
      });
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logger.error("Error storing hardware data in database", {
      error: errorMessage,
    });
    // Still log locally as fallback
    logger.info("Hardware data stored locally (fallback)", {
      device: deviceToken.substring(0, 8) + "...",
      pin: pin,
      value: value,
      dataType: isNaN(parseFloat(String(value))) ? "STRING" : "FLOAT",
    });
  }
}

export { storeDeviceInfo, storeHardwareData };
