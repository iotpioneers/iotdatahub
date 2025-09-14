"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const logger_1 = __importDefault(require("./logger"));
const client_2 = require("@prisma/client");
const prisma = new client_2.PrismaClient();
class DeviceCacheManager {
    constructor() {
        this.devices = new Map(); // deviceId -> device
        this.tokenToId = new Map(); // token -> deviceId
        this.pendingUpdates = new Map();
        this.updateTimer = null;
        this.UPDATE_DELAY = 2000; // 2 seconds instead of 5
        this.heartbeatTimer = null;
        this.HEARTBEAT_TIMEOUT = 30000; // 30 seconds for online devices
        this.OFFLINE_TIMEOUT = 60000; // 60 seconds before marking offline
        this.isInitialized = false;
        this.startUpdateTimer();
        this.startHeartbeatMonitoring();
    }
    /**
     * Initialize cache with user's devices and widgets
     */
    async initializeUserDevices(userId, organizationId) {
        try {
            // Fetch all devices for the user/organization using Prisma
            const devicesData = await prisma.device.findMany({
                where: {
                    OR: [{ userId: userId }, { organizationId: organizationId }],
                },
                include: {
                    widgets: {
                        include: {
                            pinConfig: true,
                        },
                    },
                    virtualPins: true,
                },
            });
            if (!devicesData || devicesData.length === 0) {
                logger_1.default.warn("No devices found for user/organization", {
                    userId,
                    organizationId,
                });
                this.isInitialized = true;
                return;
            }
            for (const deviceData of devicesData) {
                try {
                    // Create cached device
                    const cachedDevice = this.createCachedDevice(deviceData);
                    // Store in cache
                    this.devices.set(deviceData.id, cachedDevice);
                    this.tokenToId.set(deviceData.authToken, deviceData.id);
                }
                catch (deviceError) {
                    logger_1.default.error("Failed to process device", {
                        deviceId: deviceData.id,
                        error: deviceError instanceof Error
                            ? deviceError.message
                            : "Unknown error",
                    });
                }
            }
            this.isInitialized = true;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            logger_1.default.error("Failed to initialize device cache with Prisma", {
                error: errorMessage,
                userId,
                organizationId,
            });
            throw error;
        }
    }
    /**
     * Helper method to create cached device from database data
     */
    createCachedDevice(deviceData) {
        return {
            id: deviceData.id,
            token: deviceData.authToken,
            name: deviceData.name || "Unknown Device",
            status: deviceData.status || client_1.DeviceStatus.OFFLINE,
            lastPing: deviceData.lastPing || new Date(),
            widgets: deviceData.widgets.map((widget) => ({
                id: widget.id,
                deviceId: deviceData.id,
                pinConfig: {
                    pinNumber: widget.pinNumber?.toString() ||
                        widget.settings?.pinNumber?.toString().replace("V", "") ||
                        "0",
                    value: widget.value || widget.settings?.value || 0,
                    dataType: "FLOAT",
                },
                value: widget.value || widget.settings?.value || 0,
                lastUpdated: widget.updatedAt,
            })),
            pinHistory: new Map(),
            metadata: deviceData.metadata,
        };
    }
    /**
     * Load device from database and add to cache
     */
    async loadDeviceFromDatabase(token) {
        try {
            logger_1.default.info("Loading device from database", {
                token: this.maskToken(token),
            });
            const deviceData = await prisma.device.findFirst({
                where: {
                    authToken: token,
                },
                include: {
                    widgets: {
                        include: {
                            pinConfig: true,
                        },
                    },
                    virtualPins: true,
                },
            });
            if (!deviceData) {
                logger_1.default.warn("Device not found in database", {
                    token: this.maskToken(token),
                });
                return null;
            }
            // Create cached device
            const cachedDevice = this.createCachedDevice(deviceData);
            // Add to cache
            this.devices.set(deviceData.id, cachedDevice);
            this.tokenToId.set(deviceData.authToken, deviceData.id);
            logger_1.default.info("Device loaded from database and cached", {
                deviceId: deviceData.id,
                deviceName: cachedDevice.name,
                widgetCount: cachedDevice.widgets.length,
                token: this.maskToken(token),
            });
            return cachedDevice;
        }
        catch (error) {
            logger_1.default.error("Failed to load device from database", {
                token: this.maskToken(token),
                error: error instanceof Error ? error.message : "Unknown error",
            });
            return null;
        }
    }
    /**
     * Get device ID from token (with database fallback)
     */
    async getDeviceIdFromToken(token) {
        // First check cache
        const cachedId = this.tokenToId.get(token);
        if (cachedId) {
            return cachedId;
        }
        // Fallback to database
        logger_1.default.info("Device not found in cache, checking database", {
            token: this.maskToken(token),
        });
        const device = await this.loadDeviceFromDatabase(token);
        return device ? device.id : null;
    }
    /**
     * Get device ID from token (synchronous, cache only)
     */
    getDeviceIdFromTokenSync(token) {
        return this.tokenToId.get(token) || null;
    }
    /**
     * Get cached device by ID (with database fallback)
     */
    async getDevice(deviceId) {
        // First check cache
        const cachedDevice = this.devices.get(deviceId);
        if (cachedDevice) {
            return cachedDevice;
        }
        // Fallback to database - find by device ID
        try {
            const deviceData = await prisma.device.findUnique({
                where: { id: deviceId },
                include: {
                    widgets: {
                        include: {
                            pinConfig: true,
                        },
                    },
                    virtualPins: true,
                },
            });
            if (!deviceData) {
                return null;
            }
            const cachedDevice = this.createCachedDevice(deviceData);
            // Add to cache
            this.devices.set(deviceData.id, cachedDevice);
            this.tokenToId.set(deviceData.authToken, deviceData.id);
            logger_1.default.info("Device loaded from database by ID and cached", {
                deviceId: deviceData.id,
                deviceName: cachedDevice.name,
                token: this.maskToken(deviceData.authToken),
            });
            return cachedDevice;
        }
        catch (error) {
            logger_1.default.error("Failed to load device by ID from database", {
                deviceId,
                error: error instanceof Error ? error.message : "Unknown error",
            });
            return null;
        }
    }
    /**
     * Get cached device by ID (synchronous, cache only)
     */
    getDeviceSync(deviceId) {
        return this.devices.get(deviceId) || null;
    }
    /**
     * Get cached device by token (with database fallback)
     */
    async getDeviceByToken(token) {
        const deviceId = await this.getDeviceIdFromToken(token);
        return deviceId ? await this.getDevice(deviceId) : null;
    }
    /**
     * Get cached device by token (synchronous, cache only)
     */
    getDeviceByTokenSync(token) {
        const deviceId = this.getDeviceIdFromTokenSync(token);
        return deviceId ? this.getDeviceSync(deviceId) : null;
    }
    /**
     * Update device info in cache and queue for database update
     */
    async updateDeviceInfo(token, updates) {
        const deviceId = await this.getDeviceIdFromToken(token);
        if (!deviceId) {
            logger_1.default.warn("Device not found in cache or database for info update", {
                token: this.maskToken(token),
            });
            return;
        }
        const device = await this.getDevice(deviceId);
        if (!device)
            return;
        const wasOffline = device.status === "OFFLINE";
        Object.assign(device, updates);
        device.lastPing = updates.lastPing || new Date();
        if (!device.metadata)
            device.metadata = {};
        device.metadata.lastActivity = new Date();
        device.metadata.statusChangeTime = new Date();
        device.metadata.realTimeStatus = updates.status === "ONLINE";
        if (wasOffline && updates.status === "ONLINE") {
            logger_1.default.info("Device came back online", {
                deviceId,
                deviceName: device.name,
                downtime: device.metadata.disconnectedAt
                    ? Math.round((new Date().getTime() -
                        new Date(device.metadata.disconnectedAt).getTime()) /
                        1000) + "s"
                    : "unknown",
            });
        }
        if (updates.connectionCount !== undefined)
            device.metadata.connectionCount = updates.connectionCount;
        if (updates.disconnectedAt)
            device.metadata.disconnectedAt = updates.disconnectedAt;
        const dbCompatibleUpdates = {
            status: updates.status,
            lastPing: updates.lastPing || new Date(),
            metadata: device.metadata,
        };
        this.queueDeviceUpdate(deviceId, { device: dbCompatibleUpdates });
        logger_1.default.debug("Device info updated in cache", {
            deviceId,
            updates: Object.keys(updates),
            status: updates.status,
        });
    }
    /**
     * Update hardware data in cache and queue for database update
     */
    async updateHardwareData(token, pin, value, command, isCmd20 = false) {
        const deviceId = await this.getDeviceIdFromToken(token);
        if (!deviceId) {
            logger_1.default.warn("Device not found in cache or database for hardware update", {
                token: this.maskToken(token),
                pin,
                value,
            });
            return null;
        }
        const device = await this.getDevice(deviceId);
        if (!device) {
            logger_1.default.error("Hardware update failed - device not found", {
                deviceToken: this.maskToken(token),
                pin,
                value,
            });
            return null;
        }
        const pinStr = pin.toString();
        device.lastPing = new Date();
        device.status = "ONLINE"; // Ensure device is marked online when receiving data
        if (!device.metadata)
            device.metadata = {};
        device.metadata.lastActivity = new Date();
        device.metadata.statusChangeTime = new Date();
        device.metadata.realTimeStatus = true;
        const historyEntry = {
            pin: pinStr,
            value,
            timestamp: new Date(),
            command,
        };
        device.pinHistory.set(pinStr, historyEntry);
        let updatedWidget = null;
        for (const widget of device.widgets) {
            if (widget.pinConfig.pinNumber === pinStr) {
                widget.value = value;
                widget.pinConfig.value = value;
                widget.lastUpdated = new Date();
                updatedWidget = widget;
                break;
            }
        }
        if (isCmd20) {
            await this.updateDeviceInDatabaseImmediate(deviceId, {
                widgets: updatedWidget ? [updatedWidget] : [],
                pinHistory: [historyEntry],
                device: {
                    lastPing: new Date(),
                    status: "ONLINE",
                    metadata: device.metadata,
                },
            });
            logger_1.default.info("CMD:20 - Immediate database sync completed", {
                deviceId,
                pin,
                value,
                updateTime: new Date().toISOString(),
            });
        }
        else {
            this.queueDeviceUpdate(deviceId, {
                widgets: updatedWidget ? [updatedWidget] : [],
                pinHistory: [historyEntry],
                device: {
                    lastPing: new Date(),
                    status: "ONLINE",
                    metadata: device.metadata,
                },
            });
        }
        logger_1.default.debug("Hardware data updated in cache", {
            deviceId,
            pin,
            value,
            command,
            isCmd20,
            widgetUpdated: !!updatedWidget,
        });
        return { deviceId, updatedWidget };
    }
    async updateDeviceInDatabaseImmediate(deviceId, updates) {
        try {
            if (updates.device) {
                const { widgets, pinHistory, ...deviceOnlyUpdates } = updates.device;
                const dbUpdateData = {};
                if (deviceOnlyUpdates.status)
                    dbUpdateData.status = deviceOnlyUpdates.status;
                if (deviceOnlyUpdates.lastPing)
                    dbUpdateData.lastPing = deviceOnlyUpdates.lastPing;
                if (deviceOnlyUpdates.metadata)
                    dbUpdateData.metadata = deviceOnlyUpdates.metadata;
                await prisma.device.update({
                    where: { id: deviceId },
                    data: dbUpdateData,
                });
            }
            if (updates.widgets && updates.widgets.length > 0) {
                for (const widget of updates.widgets) {
                    await prisma.widget.update({
                        where: { id: widget.id },
                        data: {
                            value: widget.value.toString(),
                            updatedAt: new Date(),
                        },
                    });
                }
            }
            if (updates.pinHistory && updates.pinHistory.length > 0) {
                for (const entry of updates.pinHistory) {
                    await prisma.pinHistory.create({
                        data: {
                            deviceId: deviceId,
                            pinNumber: Number.parseInt(entry.pin),
                            value: entry.value.toString(),
                            dataType: isNaN(Number.parseFloat(String(entry.value)))
                                ? "STRING"
                                : "FLOAT",
                            timestamp: entry.timestamp,
                        },
                    });
                }
            }
            logger_1.default.info("Immediate database update completed", {
                deviceId,
                widgetUpdates: updates.widgets?.length || 0,
                historyEntries: updates.pinHistory?.length || 0,
            });
        }
        catch (error) {
            logger_1.default.error("Immediate database update failed", {
                deviceId,
                error: error instanceof Error ? error.message : "Unknown error",
            });
            throw error;
        }
    }
    async getDeviceLastActivity(token) {
        const deviceId = await this.getDeviceIdFromToken(token);
        if (!deviceId)
            return null;
        const device = await this.getDevice(deviceId);
        if (!device)
            return null;
        return device.metadata?.lastActivity || device.lastPing;
    }
    /**
     * Queue device updates for batch processing
     */
    queueDeviceUpdate(deviceId, updates) {
        const existing = this.pendingUpdates.get(deviceId);
        if (existing) {
            if (updates.device) {
                existing.updates.device = {
                    ...existing.updates.device,
                    ...updates.device,
                };
            }
            if (updates.widgets) {
                existing.updates.widgets = [
                    ...(existing.updates.widgets || []),
                    ...updates.widgets,
                ];
            }
            if (updates.pinHistory) {
                existing.updates.pinHistory = [
                    ...(existing.updates.pinHistory || []),
                    ...updates.pinHistory,
                ];
            }
            existing.timestamp = new Date();
        }
        else {
            this.pendingUpdates.set(deviceId, {
                deviceId,
                updates,
                timestamp: new Date(),
            });
        }
    }
    /**
     * Start the periodic database update timer
     */
    startUpdateTimer() {
        this.updateTimer = setInterval(async () => {
            await this.processPendingUpdates();
        }, this.UPDATE_DELAY);
    }
    /**
     * Process all pending updates to database
     */
    async processPendingUpdates() {
        if (this.pendingUpdates.size === 0)
            return;
        const updates = Array.from(this.pendingUpdates.values());
        this.pendingUpdates.clear();
        logger_1.default.info("Processing pending device updates", {
            batchCount: updates.length,
        });
        for (const batch of updates) {
            try {
                await this.updateDeviceInDatabase(batch);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Unknown error";
                logger_1.default.error("Failed to update device in database", {
                    deviceId: batch.deviceId,
                    error: errorMessage,
                });
                this.pendingUpdates.set(batch.deviceId, batch);
            }
        }
    }
    /**
     * Update device in database
     */
    async updateDeviceInDatabase(batch) {
        const { deviceId, updates } = batch;
        try {
            if (updates.device) {
                const { widgets, pinHistory, ...deviceOnlyUpdates } = updates.device;
                const dbUpdateData = {};
                if (deviceOnlyUpdates.status)
                    dbUpdateData.status = deviceOnlyUpdates.status;
                if (deviceOnlyUpdates.lastPing)
                    dbUpdateData.lastPing = deviceOnlyUpdates.lastPing;
                if (deviceOnlyUpdates.metadata)
                    dbUpdateData.metadata = deviceOnlyUpdates.metadata;
                await prisma.device.update({
                    where: { id: deviceId },
                    data: dbUpdateData,
                });
            }
            if (updates.widgets && updates.widgets.length > 0) {
                for (const widget of updates.widgets) {
                    await prisma.widget.update({
                        where: { id: widget.id },
                        data: {
                            value: widget.value.toString(),
                            updatedAt: new Date(),
                        },
                    });
                }
            }
            if (updates.pinHistory && updates.pinHistory.length > 0) {
                for (const entry of updates.pinHistory) {
                    await prisma.pinHistory.create({
                        data: {
                            deviceId: deviceId,
                            pinNumber: Number.parseInt(entry.pin),
                            value: entry.value.toString(),
                            dataType: isNaN(Number.parseFloat(String(entry.value)))
                                ? "STRING"
                                : "FLOAT",
                            timestamp: entry.timestamp,
                        },
                    });
                }
            }
            logger_1.default.debug("Device updated in database via Prisma", {
                deviceId,
                deviceUpdates: !!updates.device,
                widgetUpdates: updates.widgets?.length || 0,
                historyEntries: updates.pinHistory?.length || 0,
            });
        }
        catch (error) {
            logger_1.default.error("Failed to update device in database via Prisma", {
                deviceId,
                error: error instanceof Error ? error.message : "Unknown error",
            });
            throw error;
        }
    }
    /**
     * Get all cached devices
     */
    getAllDevices() {
        return Array.from(this.devices.values());
    }
    /**
     * Check if cache is initialized
     */
    isReady() {
        return this.isInitialized;
    }
    /**
     * Get cache statistics
     */
    getStats() {
        return {
            deviceCount: this.devices.size,
            pendingUpdates: this.pendingUpdates.size,
            isInitialized: this.isInitialized,
            memoryUsage: {
                devices: this.devices.size,
                tokenMappings: this.tokenToId.size,
            },
        };
    }
    /**
     * Mask token for logging
     */
    maskToken(token) {
        return token && token.length > 8
            ? `${token.substring(0, 4)}...${token.substring(token.length - 4)}`
            : "****";
    }
    /**
     * Cleanup resources
     */
    cleanup() {
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
            this.updateTimer = null;
        }
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
        this.processPendingUpdates().catch((error) => {
            logger_1.default.error("Error during cleanup update processing", { error });
        });
        logger_1.default.info("Device cache manager cleaned up");
    }
    startHeartbeatMonitoring() {
        this.heartbeatTimer = setInterval(async () => {
            await this.checkDeviceHeartbeats();
        }, 10000); // Check every 10 seconds
    }
    async checkDeviceHeartbeats() {
        const now = new Date();
        const devicesUpdated = [];
        for (const [deviceId, device] of this.devices) {
            const timeSinceLastPing = now.getTime() - device.lastPing.getTime();
            const wasOnline = device.status === "ONLINE";
            if (wasOnline && timeSinceLastPing > this.HEARTBEAT_TIMEOUT) {
                device.status = "OFFLINE";
                if (!device.metadata)
                    device.metadata = {};
                device.metadata.disconnectedAt = now;
                device.metadata.statusChangeTime = now;
                device.metadata.realTimeStatus = false;
                this.queueDeviceUpdate(deviceId, {
                    device: {
                        status: "OFFLINE",
                        metadata: device.metadata,
                    },
                });
                devicesUpdated.push(deviceId);
                logger_1.default.info("Device marked offline due to heartbeat timeout", {
                    deviceId,
                    deviceName: device.name,
                    timeSinceLastPing: Math.round(timeSinceLastPing / 1000) + "s",
                });
            }
        }
        if (devicesUpdated.length > 0) {
            logger_1.default.info("Heartbeat check completed", {
                devicesChecked: this.devices.size,
                devicesUpdated: devicesUpdated.length,
                offlineDevices: devicesUpdated,
            });
        }
    }
}
exports.default = DeviceCacheManager;
