const config = require("./config");
const logger = require("./logger");

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

module.exports = {
  storeDeviceInfo,
  storeHardwareData,
};
