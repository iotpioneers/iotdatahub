const express = require("express");
const cors = require("cors");
const config = require("./config");
const logger = require("./logger");

function createAPIServer(deviceManager, protocolHandler) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Middleware to validate device token
  const validateDevice = (req, res, next) => {
    const { deviceToken } = req.body;
    if (!deviceToken) {
      return res.status(400).json({ error: "Device token is required" });
    }

    const device = deviceManager.getDevice(deviceToken);
    if (!device) {
      return res
        .status(404)
        .json({ error: "Device not found or not connected" });
    }

    req.device = device;
    next();
  };

  // POST /api/hardware/send - Generic hardware command sender
  app.post("/api/hardware/send", validateDevice, async (req, res) => {
    try {
      const { deviceToken, command, pin, value } = req.body;

      console.log("====================================");
      console.log(
        "Sending hardware command:",
        command,
        "to pin:",
        pin,
        "with value:",
        value,
        "to device:",
        deviceToken,
      );
      console.log("====================================");

      if (!command || pin === undefined) {
        return res.status(400).json({
          error: "Command and pin are required",
          example: {
            deviceToken: "your-device-token",
            command: "vw",
            pin: 3,
            value: 1,
          },
        });
      }

      // Call the method on the protocolHandler instance
      const success = await protocolHandler.sendHardwareCommand(
        deviceToken,
        command,
        pin,
        value,
      );

      console.log("====================================");
      console.log(
        "Hardware command sent:",
        success,
        "to pin:",
        pin,
        "with value:",
        value,
        "to device:",
        deviceToken,
      );
      console.log("====================================");

      if (success) {
        res.json({
          success: true,
          message: "Hardware command sent successfully",
          data: {
            command,
            pin,
            value,
            deviceToken: deviceManager.maskToken(deviceToken),
          },
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Failed to send hardware command",
        });
      }
    } catch (error) {
      logger.error("API hardware send error", { error: error.message });
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // POST /api/hardware/virtual-write - Send virtual write command
  app.post("/api/hardware/virtual-write", validateDevice, async (req, res) => {
    try {
      const { deviceToken, pin, value } = req.body;

      if (pin === undefined || value === undefined) {
        return res.status(400).json({
          error: "Pin and value are required",
          example: {
            deviceToken: "your-device-token",
            pin: 3,
            value: 1,
          },
        });
      }

      // Call the method on the protocolHandler instance
      const success = await protocolHandler.sendVirtualWrite(
        deviceToken,
        pin,
        value,
      );

      res.json({
        success,
        message: success
          ? "Virtual write command sent"
          : "Failed to send command",
        data: { pin, value, deviceToken: deviceManager.maskToken(deviceToken) },
      });
    } catch (error) {
      logger.error("API virtual write error", { error: error.message });
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // POST /api/hardware/digital-write - Send digital write command
  app.post("/api/hardware/digital-write", validateDevice, async (req, res) => {
    try {
      const { deviceToken, pin, value } = req.body;

      if (pin === undefined || value === undefined) {
        return res.status(400).json({
          error: "Pin and value are required",
          example: {
            deviceToken: "your-device-token",
            pin: 13,
            value: 1,
          },
        });
      }

      // Validate digital value (0 or 1)
      const digitalValue = parseInt(value);
      if (digitalValue !== 0 && digitalValue !== 1) {
        return res.status(400).json({
          error: "Digital value must be 0 or 1",
        });
      }

      // Call the method on the protocolHandler instance
      const success = await protocolHandler.sendDigitalWrite(
        deviceToken,
        pin,
        digitalValue,
      );

      res.json({
        success,
        message: success
          ? "Digital write command sent"
          : "Failed to send command",
        data: {
          pin,
          value: digitalValue,
          deviceToken: deviceManager.maskToken(deviceToken),
        },
      });
    } catch (error) {
      logger.error("API digital write error", { error: error.message });
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // POST /api/hardware/read - Send read commands (virtual or digital)
  app.post("/api/hardware/read", validateDevice, async (req, res) => {
    try {
      const { deviceToken, pin, type = "virtual" } = req.body;

      if (pin === undefined) {
        return res.status(400).json({
          error: "Pin is required",
          example: {
            deviceToken: "your-device-token",
            pin: 3,
            type: "virtual", // or 'digital'
          },
        });
      }

      let success;
      if (type === "digital") {
        // Call the method on the protocolHandler instance
        success = await protocolHandler.sendDigitalRead(deviceToken, pin);
      } else {
        // Call the method on the protocolHandler instance
        success = await protocolHandler.sendVirtualRead(deviceToken, pin);
      }

      res.json({
        success,
        message: success
          ? `${type} read command sent`
          : "Failed to send command",
        data: { pin, type, deviceToken: deviceManager.maskToken(deviceToken) },
      });
    } catch (error) {
      logger.error("API read error", { error: error.message });
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return app;
}

function startAPIServer(app) {
  // Start API server
  app.listen(config.apiPort, () => {
    logger.info("Hardware API server started", { port: config.apiPort });
    console.log(`
====================================
🚀 Hardware Command API is running on port ${config.apiPort}
====================================
`);
  });

  return app;
}

module.exports = {
  createAPIServer,
  startAPIServer,
};
