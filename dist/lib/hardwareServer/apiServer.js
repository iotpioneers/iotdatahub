"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAPIServer = createAPIServer;
exports.startAPIServer = startAPIServer;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const websocketManager_1 = __importDefault(require("./websocketManager"));
const config_1 = __importDefault(require("./config"));
const logger_1 = __importDefault(require("./logger"));
function createAPIServer(deviceManager, protocolHandler, deviceCache) {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    }));
    app.use(express_1.default.json());
    const wsManager = new websocketManager_1.default(deviceCache);
    // Middleware to validate device token
    const validateDevice = (req, res, next) => {
        const { deviceToken } = req.body;
        if (!deviceToken) {
            res
                .status(400)
                .json({ error: "Device token is required" });
            return;
        }
        let device = deviceManager.getDevice(deviceToken);
        if (!device) {
            res.status(404).json({
                error: "Device not found or not connected",
            });
            return;
        }
        req.device = device;
        next();
    };
    // POST /api/hardware/send - Generic hardware command sender
    app.post("/api/hardware/send", validateDevice, async (req, res) => {
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
                });
                return;
            }
            const success = await protocolHandler.sendHardwareCommand(deviceToken, command, pin, value);
            if (success) {
                const responseData = {
                    command,
                    pin,
                    value,
                    deviceToken: deviceManager.maskToken(deviceToken),
                };
                // INSTANT WebSocket broadcast using cache (NO DATABASE DELAYS!)
                wsManager.broadcastHardwareUpdate(deviceToken, pin, value, "VIRTUAL_WRITE", true);
                res.json({
                    success: true,
                    message: "Hardware command sent successfully",
                    data: responseData,
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    error: "Failed to send hardware command",
                });
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            logger_1.default.error("API hardware send error", { error: errorMessage });
            res.status(500).json({ error: "Internal server error" });
        }
    });
    // POST /api/hardware/virtual-write - Send virtual write command
    app.post("/api/hardware/virtual-write", validateDevice, async (req, res) => {
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
                });
                return;
            }
            const success = await protocolHandler.sendVirtualWrite(deviceToken, pin, value);
            // INSTANT WebSocket broadcast using cache (NO DATABASE DELAYS!)
            wsManager.broadcastHardwareUpdate(deviceToken, pin, value, "VIRTUAL_WRITE", true);
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
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            logger_1.default.error("API virtual write error", { error: errorMessage });
            res.status(500).json({ error: "Internal server error" });
        }
    });
    // POST /api/hardware/digital-write - Send digital write command
    app.post("/api/hardware/digital-write", validateDevice, async (req, res) => {
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
                });
                return;
            }
            // Validate digital value (0 or 1)
            const digitalValue = parseInt(String(value), 10);
            if (digitalValue !== 0 && digitalValue !== 1) {
                res.status(400).json({
                    error: "Digital value must be 0 or 1",
                });
                return;
            }
            const success = await protocolHandler.sendDigitalWrite(deviceToken, pin, digitalValue);
            // INSTANT WebSocket broadcast using cache (NO DATABASE DELAYS!)
            wsManager.broadcastHardwareUpdate(deviceToken, pin, value, "DIGITAL_WRITE", true);
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
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            logger_1.default.error("API digital write error", { error: errorMessage });
            res.status(500).json({ error: "Internal server error" });
        }
    });
    // POST /api/hardware/read - Send read commands (virtual or digital)
    app.post("/api/hardware/read", validateDevice, async (req, res) => {
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
                });
                return;
            }
            let success;
            if (type === "digital") {
                success = await protocolHandler.sendDigitalRead(deviceToken, pin);
            }
            else {
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
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            logger_1.default.error("API read error", { error: errorMessage });
            res.status(500).json({ error: "Internal server error" });
        }
    });
    return app;
}
function startAPIServer(app) {
    // Start API server
    app.listen(config_1.default.apiPort, () => {
        logger_1.default.info("Hardware API server started", { port: config_1.default.apiPort });
    });
    return app;
}
