import express, { Response, NextFunction, Application } from "express";
import cors from "cors";
import type {
  IDeviceManager,
  IProtocolHandler,
  DeviceRequest,
  APIResponse,
  HardwareCommandData,
} from "./types";
import WebSocketManager from "./websocketManager";
import config from "./config";
import logger from "./logger";
import DeviceCacheManager from "./deviceCacheManager";

function createAPIServer(
  deviceManager: IDeviceManager,
  protocolHandler: IProtocolHandler,
  deviceCache: DeviceCacheManager,
): Application {
  const app = express();
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    }),
  );

  app.use(express.json());

  const wsManager = new WebSocketManager(deviceCache);

  // Middleware to validate device token
  const validateDevice = (
    req: DeviceRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    const { deviceToken } = req.body;
    if (!deviceToken) {
      res
        .status(400)
        .json({ error: "Device token is required" } as APIResponse);
      return;
    }

    let device = deviceManager.getDevice(deviceToken);
    if (!device) {
      res.status(404).json({
        error: "Device not found or not connected",
      } as APIResponse);
      return;
    }

    req.device = device;
    next();
  };

  // POST /api/hardware/send - Generic hardware command sender
  app.post(
    "/api/hardware/send",
    validateDevice,
    async (req: DeviceRequest, res: Response): Promise<void> => {
      try {
        const { deviceToken, command, pin, value } = req.body;

        if (!command || pin === undefined) {
          res.status(400).json({
            success: false,
            error: "Command and pin are required",
            example: {
              deviceToken: "your-device-token",
              command: "vw",
              pin: 3,
              value: 1,
            },
          } as APIResponse);
          return;
        }

        const success = await protocolHandler.sendHardwareCommand(
          deviceToken,
          command,
          pin,
          value,
        );

        if (success) {
          const responseData: HardwareCommandData = {
            command,
            pin,
            value,
            deviceToken: deviceManager.maskToken(deviceToken),
          };

          // INSTANT WebSocket broadcast using cache (NO DATABASE DELAYS!)
          wsManager.broadcastHardwareUpdate(
            deviceToken,
            pin,
            value!,
            "VIRTUAL_WRITE",
            true, // Pass CMD:20 flag for priority handling
          );

          res.json({
            success: true,
            message: "Hardware command sent successfully",
            data: responseData,
          } as APIResponse<HardwareCommandData>);
        } else {
          res.status(500).json({
            success: false,
            error: "Failed to send hardware command",
          } as APIResponse);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        logger.error("API hardware send error", { error: errorMessage });
        res.status(500).json({ error: "Internal server error" } as APIResponse);
      }
    },
  );

  // POST /api/hardware/virtual-write - Send virtual write command
  app.post(
    "/api/hardware/virtual-write",
    validateDevice,
    async (req: DeviceRequest, res: Response): Promise<void> => {
      try {
        const { deviceToken, pin, value } = req.body;

        if (pin === undefined || value === undefined) {
          res.status(400).json({
            success: false,
            error: "Pin and value are required",
            example: {
              deviceToken: "your-device-token",
              pin: 3,
              value: 1,
            },
          } as APIResponse);
          return;
        }

        const success = await protocolHandler.sendVirtualWrite(
          deviceToken,
          pin,
          value,
        );

        // INSTANT WebSocket broadcast using cache (NO DATABASE DELAYS!)
        wsManager.broadcastHardwareUpdate(
          deviceToken,
          pin,
          value!,
          "VIRTUAL_WRITE",
          true, // Pass CMD:20 flag for priority handling
        );

        res.json({
          success,
          message: success
            ? "Virtual write command sent"
            : "Failed to send command",
          data: {
            pin,
            value,
            deviceToken: deviceManager.maskToken(deviceToken),
          },
        } as APIResponse);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        logger.error("API virtual write error", { error: errorMessage });
        res.status(500).json({ error: "Internal server error" } as APIResponse);
      }
    },
  );

  // POST /api/hardware/digital-write - Send digital write command
  app.post(
    "/api/hardware/digital-write",
    validateDevice,
    async (req: DeviceRequest, res: Response): Promise<void> => {
      try {
        const { deviceToken, pin, value } = req.body;

        if (pin === undefined || value === undefined) {
          res.status(400).json({
            success: false,
            error: "Pin and value are required",
            example: {
              deviceToken: "your-device-token",
              pin: 13,
              value: 1,
            },
          } as APIResponse);
          return;
        }

        // Validate digital value (0 or 1)
        const digitalValue = parseInt(String(value), 10);
        if (digitalValue !== 0 && digitalValue !== 1) {
          res.status(400).json({
            error: "Digital value must be 0 or 1",
          } as APIResponse);
          return;
        }

        const success = await protocolHandler.sendDigitalWrite(
          deviceToken,
          pin,
          digitalValue,
        );

        // INSTANT WebSocket broadcast using cache (NO DATABASE DELAYS!)
        wsManager.broadcastHardwareUpdate(
          deviceToken,
          pin,
          value!,
          "DIGITAL_WRITE",
          true, // Pass CMD:20 flag for priority handling
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
        } as APIResponse);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        logger.error("API digital write error", { error: errorMessage });
        res.status(500).json({ error: "Internal server error" } as APIResponse);
      }
    },
  );

  // POST /api/hardware/read - Send read commands (virtual or digital)
  app.post(
    "/api/hardware/read",
    validateDevice,
    async (req: DeviceRequest, res: Response): Promise<void> => {
      try {
        const { deviceToken, pin, type = "virtual" } = req.body;

        if (pin === undefined) {
          res.status(400).json({
            success: false,
            error: "Pin is required",
            example: {
              deviceToken: "your-device-token",
              pin: 3,
              type: "virtual", // or 'digital'
            },
          } as APIResponse);
          return;
        }

        let success: boolean;
        if (type === "digital") {
          success = await protocolHandler.sendDigitalRead(deviceToken, pin);
        } else {
          success = await protocolHandler.sendVirtualRead(deviceToken, pin);
        }

        res.json({
          success,
          message: success
            ? `${type} read command sent`
            : "Failed to send command",
          data: {
            pin,
            type,
            deviceToken: deviceManager.maskToken(deviceToken),
          },
        } as APIResponse);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        logger.error("API read error", { error: errorMessage });
        res.status(500).json({ error: "Internal server error" } as APIResponse);
      }
    },
  );

  return app;
}

function startAPIServer(app: Application): Application {
  // Start API server
  app.listen(config.apiPort, () => {
    logger.info("Hardware API server started", { port: config.apiPort });
  });

  return app;
}

export { createAPIServer, startAPIServer };
