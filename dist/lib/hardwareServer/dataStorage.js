"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeDeviceInfo = storeDeviceInfo;
exports.storeHardwareData = storeHardwareData;
exports.updateDeviceStatus = updateDeviceStatus;
const logger_1 = __importDefault(require("./logger"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class DatabaseQueue {
    constructor() {
        this.queue = [];
        this.processing = false;
        this.batchedData = new Map();
        this.BATCH_SIZE = 5; // Reduced from 10
        this.BATCH_TIMEOUT = 1000; // Reduced from 2000ms to 1000ms
        this.MAX_RETRIES = 3;
        this.batchTimer = null;
    }
    async addOperation(operation) {
        const queuedOp = {
            ...operation,
            id: `${operation.type}_${Date.now()}_${Math.random()}`,
            timestamp: Date.now(),
            retries: 0,
        };
        this.queue.push(queuedOp);
        if (!this.processing) {
            this.processQueue();
        }
    }
    async processQueue() {
        if (this.processing || this.queue.length === 0)
            return;
        this.processing = true;
        while (this.queue.length > 0) {
            const operation = this.queue.shift();
            try {
                await this.executeOperation(operation);
            }
            catch (error) {
                if (operation.retries < this.MAX_RETRIES) {
                    operation.retries++;
                    this.queue.unshift(operation); // Put back at front for retry
                    logger_1.default.warn(`Retrying database operation ${operation.id}`, {
                        retries: operation.retries,
                        error: error instanceof Error ? error.message : "Unknown error",
                    });
                    await new Promise((resolve) => setTimeout(resolve, Math.pow(2, operation.retries) * 500)); // Reduced from 1000ms
                }
                else {
                    logger_1.default.error(`Failed database operation after ${this.MAX_RETRIES} retries`, {
                        operationId: operation.id,
                        type: operation.type,
                        error: error instanceof Error ? error.message : "Unknown error",
                    });
                }
            }
            await new Promise((resolve) => setTimeout(resolve, 25)); // Reduced from 50ms
        }
        this.processing = false;
    }
    async executeOperation(operation) {
        switch (operation.type) {
            case "device_info":
                await this.storeDeviceInfoInternal(operation.deviceToken, operation.data.deviceInfo, operation.data.clientIP);
                break;
            case "hardware_data":
                await this.addToBatch(operation.deviceToken, operation.data.pin, operation.data.value);
                break;
            case "device_update":
                await this.updateDeviceStatusInternal(operation.deviceToken, operation.data.status);
                break;
        }
    }
    async addToBatch(deviceToken, pin, value) {
        const device = await prisma.device.findUnique({
            where: { authToken: deviceToken },
            select: { id: true, name: true },
        });
        if (!device) {
            logger_1.default.warn("Device not found for batched hardware data", {
                token: deviceToken.substring(0, 8) + "...",
                pin,
                value,
            });
            return;
        }
        const dataType = isNaN(Number.parseFloat(String(value)))
            ? "STRING"
            : "FLOAT";
        const batchKey = device.id;
        if (!this.batchedData.has(batchKey)) {
            this.batchedData.set(batchKey, []);
        }
        this.batchedData.get(batchKey).push({
            deviceId: device.id,
            deviceToken,
            pin,
            value,
            dataType,
            timestamp: new Date(),
        });
        if (this.batchedData.get(batchKey).length >= this.BATCH_SIZE) {
            await this.processBatch(batchKey);
        }
        else {
            this.scheduleBatchProcessing();
        }
    }
    scheduleBatchProcessing() {
        if (this.batchTimer)
            return;
        this.batchTimer = setTimeout(async () => {
            await this.processAllBatches();
            this.batchTimer = null;
        }, this.BATCH_TIMEOUT);
    }
    async processAllBatches() {
        const batchKeys = Array.from(this.batchedData.keys());
        logger_1.default.info("Processing pending device updates", {
            batchCount: batchKeys.length,
        });
        for (const batchKey of batchKeys) {
            await this.processBatch(batchKey);
        }
    }
    async processBatch(deviceId) {
        const batch = this.batchedData.get(deviceId);
        if (!batch || batch.length === 0)
            return;
        try {
            await prisma.$transaction(async (tx) => {
                await tx.device.update({
                    where: { id: deviceId },
                    data: {
                        status: "ONLINE",
                        lastPing: new Date(),
                    },
                });
                const CHUNK_SIZE = 3;
                for (let i = 0; i < batch.length; i += CHUNK_SIZE) {
                    const chunk = batch.slice(i, i + CHUNK_SIZE);
                    for (const data of chunk) {
                        await tx.virtualPin.upsert({
                            where: {
                                deviceId_pinNumber: {
                                    deviceId: data.deviceId,
                                    pinNumber: data.pin,
                                },
                            },
                            update: {
                                value: data.value.toString(),
                                dataType: data.dataType,
                                lastUpdated: data.timestamp,
                            },
                            create: {
                                deviceId: data.deviceId,
                                pinNumber: data.pin,
                                value: data.value.toString(),
                                dataType: data.dataType,
                                lastUpdated: data.timestamp,
                            },
                        });
                    }
                }
            }, {
                timeout: 15000,
            });
            await this.processHistoryAndWidgets(deviceId, batch);
            logger_1.default.debug("Device updated in database via Prisma", {
                deviceId,
                deviceUpdates: true,
                widgetUpdates: batch.length,
                historyEntries: batch.length,
            });
        }
        catch (error) {
            logger_1.default.error("Error processing hardware data batch", {
                deviceId,
                batchSize: batch.length,
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
        finally {
            this.batchedData.delete(deviceId);
        }
    }
    async processHistoryAndWidgets(deviceId, batch) {
        try {
            await prisma.$transaction(async (tx) => {
                for (const data of batch) {
                    await tx.pinHistory.create({
                        data: {
                            deviceId: data.deviceId,
                            pinNumber: data.pin,
                            value: data.value.toString(),
                            dataType: data.dataType,
                            timestamp: data.timestamp,
                        },
                    });
                }
            }, {
                timeout: 10000,
            });
            await prisma.$transaction(async (tx) => {
                const uniquePins = [...new Set(batch.map((d) => d.pin))];
                for (const pin of uniquePins) {
                    const latestData = batch
                        .filter((d) => d.pin === pin)
                        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
                    await tx.widget.updateMany({
                        where: {
                            deviceId: deviceId,
                            pinNumber: pin,
                        },
                        data: {
                            value: latestData.value.toString(),
                            updatedAt: latestData.timestamp,
                        },
                    });
                }
            }, {
                timeout: 10000,
            });
        }
        catch (error) {
            logger_1.default.warn("Error processing history/widgets (non-critical)", {
                deviceId,
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    async storeDeviceInfoInternal(deviceToken, deviceInfo, clientIP) {
        const device = await prisma.device.findUnique({
            where: { authToken: deviceToken },
        });
        if (!device) {
            logger_1.default.warn("Device not found for info update", {
                token: deviceToken.substring(0, 8) + "...",
            });
            return;
        }
        const deviceType = deviceInfo.device?.startsWith("ESP")
            ? "GATEWAY"
            : deviceInfo.device?.startsWith("ARDUINO")
                ? "CONTROLLER"
                : device.deviceType;
        const updatedDevice = await prisma.device.update({
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
                            ? Number.parseInt(deviceInfo.heartbeat, 10)
                            : null,
                        bufferSize: deviceInfo.buffer
                            ? Number.parseInt(deviceInfo.buffer, 10)
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
        logger_1.default.info("Device info stored in database", {
            device: updatedDevice.name,
            deviceId: updatedDevice.id,
            updates: Object.keys(deviceInfo),
        });
    }
    async updateDeviceStatusInternal(deviceToken, status) {
        const device = await prisma.device.findUnique({
            where: { authToken: deviceToken },
            select: { id: true, name: true },
        });
        if (!device) {
            logger_1.default.warn("Device not found for status update", {
                token: deviceToken.substring(0, 8) + "...",
                status,
            });
            return;
        }
        await prisma.device.update({
            where: { id: device.id },
            data: {
                status: status,
                lastPing: new Date(),
            },
        });
        logger_1.default.info("Device status updated", {
            device: device.name,
            deviceId: device.id,
            status,
        });
    }
}
const dbQueue = new DatabaseQueue();
async function storeDeviceInfo(deviceToken, deviceInfo, clientIP) {
    await dbQueue.addOperation({
        type: "device_info",
        deviceToken,
        data: { deviceInfo, clientIP },
    });
}
async function storeHardwareData(deviceToken, pin, value) {
    await dbQueue.addOperation({
        type: "hardware_data",
        deviceToken,
        data: { pin, value },
    });
}
async function updateDeviceStatus(deviceToken, status) {
    await dbQueue.addOperation({
        type: "device_update",
        deviceToken,
        data: { status },
    });
}
