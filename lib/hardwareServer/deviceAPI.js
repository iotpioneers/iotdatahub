const logger = require("./logger");

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

module.exports = createDeviceAPI;
