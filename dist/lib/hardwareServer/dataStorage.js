"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeDeviceInfo = storeDeviceInfo;
exports.storeHardwareData = storeHardwareData;
const logger_1 = __importDefault(require("./logger"));
const client_1 = __importDefault(require("../../prisma/client"));
async function storeDeviceInfo(deviceToken, deviceInfo, clientIP) {
    try {
        // Find the device by auth token
        const device = await client_1.default.device.findUnique({
            where: { authToken: deviceToken },
        });
        if (!device) {
            logger_1.default.warn("Device not found for info update", {
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
        const updatedDevice = await client_1.default.device.update({
            where: { id: device.id },
            data: {
                firmware: deviceInfo.firmware || device.firmware,
                model: deviceInfo.device || device.model,
                ipAddress: clientIP || device.ipAddress,
                deviceType: deviceType,
                metadata: deviceInfo
                    ? {
                        ...(device.metadata || {}),
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
        await client_1.default.deviceLog.create({
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
        logger_1.default.info("Device info stored in database", {
            device: updatedDevice.name,
            deviceId: updatedDevice.id,
            updates: Object.keys(deviceInfo),
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        logger_1.default.error("Error storing device info in database", {
            error: errorMessage,
        });
    }
}
async function storeHardwareData(deviceToken, pin, value) {
    try {
        // Find the device by auth token
        const device = await client_1.default.device.findUnique({
            where: { authToken: deviceToken },
        });
        if (!device) {
            logger_1.default.warn("Device not found for hardware data", {
                token: deviceToken.substring(0, 8) + "...",
                pin,
                value,
            });
            return;
        }
        // Update device status to ONLINE since we're receiving data
        await client_1.default.device.update({
            where: { id: device.id },
            data: {
                status: "ONLINE",
                lastPing: new Date(),
            },
        });
        const dataType = isNaN(parseFloat(String(value))) ? "STRING" : "FLOAT";
        // Upsert virtual pin data
        await client_1.default.virtualPin.upsert({
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
        await client_1.default.pinHistory.create({
            data: {
                deviceId: device.id,
                pinNumber: pin,
                value: value.toString(),
                dataType: dataType,
                timestamp: new Date(),
            },
        });
        // Update widgets that use this pin
        const widgets = await client_1.default.widget.findMany({
            where: {
                deviceId: device.id,
                pinNumber: pin,
            },
        });
        for (const widget of widgets) {
            await client_1.default.widget.update({
                where: { id: widget.id },
                data: {
                    value: value.toString(),
                    updatedAt: new Date(),
                },
            });
        }
        logger_1.default.info("Hardware data stored in database", {
            device: device.name,
            deviceId: device.id,
            pin,
            value,
            dataType,
            widgetUpdates: widgets.length,
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        logger_1.default.error("Error storing hardware data in database", {
            error: errorMessage,
        });
    }
}
