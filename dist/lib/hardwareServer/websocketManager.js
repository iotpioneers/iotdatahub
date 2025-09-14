"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("./logger"));
// Load environment variables
dotenv_1.default.config();
class WebSocketManager {
    constructor(deviceCache) {
        this.wss = null;
        this.clients = new Map();
        this.deviceCache = deviceCache;
    }
    initialize(server) {
        this.wss = new ws_1.WebSocketServer({
            server,
            path: "/api/ws",
        });
        this.wss.on("connection", this.handleConnection.bind(this));
    }
    handleConnection(ws, req) {
        const clientId = this.generateClientId();
        const client = {
            ws,
            subscriptions: new Set(),
        };
        this.clients.set(clientId, client);
        ws.on("message", (data) => {
            try {
                const message = JSON.parse(data.toString());
                this.handleMessage(clientId, message);
            }
            catch (error) {
                this.sendError(ws, "Invalid message format");
            }
        });
        ws.on("close", () => {
            this.clients.delete(clientId);
        });
        ws.on("error", (error) => {
            const errorMessage = error instanceof Error ? error.message : String(error);
            logger_1.default.error("WebSocket error", { clientId, error: errorMessage });
            this.clients.delete(clientId);
        });
        // Send connection confirmation with cache status
        this.sendMessage(ws, {
            type: "CONNECTION_ESTABLISHED",
            clientId,
            cacheReady: this.deviceCache.isReady(),
            timestamp: new Date().toISOString(),
        });
    }
    handleMessage(clientId, message) {
        const client = this.clients.get(clientId);
        if (!client)
            return;
        switch (message.type) {
            case "SUBSCRIBE_DEVICE":
                if (message.deviceId) {
                    client.deviceId = message.deviceId;
                    client.userId = message.userId;
                    client.subscriptions.add(message.deviceId);
                    // Initialize cache if not already done and we have user info
                    if (!this.deviceCache.isReady() &&
                        message.userId &&
                        message.organizationId) {
                        this.initializeCacheForUser(message.userId, message.organizationId);
                    }
                    this.sendMessage(client.ws, {
                        type: "SUBSCRIPTION_CONFIRMED",
                        deviceId: message.deviceId,
                        timestamp: new Date().toISOString(),
                    });
                }
                break;
            case "UNSUBSCRIBE_DEVICE":
                if (message.deviceId) {
                    client.subscriptions.delete(message.deviceId);
                }
                break;
            case "PING":
                this.sendMessage(client.ws, {
                    type: "PONG",
                    cacheStats: this.deviceCache.getStats(),
                    timestamp: new Date().toISOString(),
                });
                break;
            case "INITIALIZE_CACHE":
                // Allow clients to manually trigger cache initialization
                if (message.userId && message.organizationId) {
                    this.initializeCacheForUser(message.userId, message.organizationId);
                }
                break;
            case "REFRESH_DEVICE":
                if (message.deviceId) {
                    this.handleDeviceRefresh(clientId, message.deviceId);
                }
                break;
        }
    }
    /**
     * Initialize device cache for a specific user
     */
    async initializeCacheForUser(userId, organizationId) {
        if (this.deviceCache.isReady()) {
            logger_1.default.info("Device cache already initialized");
            return;
        }
        try {
            await this.deviceCache.initializeUserDevices(userId, organizationId);
            // Notify all clients that cache is ready
            this.broadcastToAll({
                type: "CACHE_INITIALIZED",
                timestamp: new Date().toISOString(),
                stats: this.deviceCache.getStats(),
            });
        }
        catch (error) {
            logger_1.default.error("Failed to initialize device cache", {
                userId,
                organizationId,
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    /**
     * Main method to broadcast hardware data updates (NOW INSTANT!)
     */
    async broadcastHardwareUpdate(deviceToken, pin, value, command, isCmd20 = false) {
        if (!this.wss)
            return;
        // INSTANT lookup from cache - no API call!
        const result = await this.deviceCache.updateHardwareData(deviceToken, pin, value, command, isCmd20);
        if (result) {
            const { deviceId, updatedWidget } = result;
            const update = {
                deviceId,
                pin,
                value,
                timestamp: new Date().toISOString(),
                command,
                isCmd20,
                widget: updatedWidget
                    ? {
                        id: updatedWidget.id,
                        value: updatedWidget.value,
                        pinConfig: updatedWidget.pinConfig,
                    }
                    : undefined,
            };
            const message = {
                type: "HARDWARE_DATA",
                deviceId,
                data: update,
                priority: isCmd20 ? "HIGH" : "NORMAL",
            };
            this.broadcastToSubscribers(deviceId, message);
            if (isCmd20 && updatedWidget) {
                this.broadcastWidgetStateSync(deviceId, updatedWidget);
            }
            // Update device status to ONLINE
            this.deviceCache.updateDeviceInfo(deviceToken, {
                status: "ONLINE",
                lastPing: new Date(),
                lastActivity: new Date(),
            });
        }
        else {
            logger_1.default.warn("Hardware update failed - device not in cache", {
                deviceToken: deviceToken.substring(0, 8) + "...",
                pin,
                value,
            });
        }
    }
    broadcastWidgetStateSync(deviceId, widget) {
        const message = {
            type: "WIDGET_STATE_SYNC",
            deviceId,
            data: {
                widgetId: widget.id,
                pin: widget.pinConfig.pinNumber,
                value: widget.value,
                timestamp: new Date().toISOString(),
                forceUpdate: true, // Force UI to update immediately
            },
        };
        this.broadcastToSubscribers(deviceId, message);
    }
    /**
     * Broadcast device status updates (using cache)
     */
    async broadcastDeviceStatus(deviceToken, status, lastPing) {
        if (!this.wss)
            return;
        this.deviceCache.updateDeviceInfo(deviceToken, {
            status: status,
            lastPing: lastPing || new Date(),
            lastActivity: new Date(),
            statusChangeTime: new Date(),
        });
        // Get device ID from cache
        const deviceId = await this.deviceCache.getDeviceIdFromToken(deviceToken);
        if (deviceId) {
            const message = {
                type: "DEVICE_STATUS",
                deviceId,
                data: {
                    status,
                    lastPing: (lastPing || new Date()).toISOString(),
                    timestamp: new Date().toISOString(),
                    realTime: true, // Flag to indicate real-time status update
                },
            };
            this.broadcastToSubscribers(deviceId, message);
        }
    }
    /**
     * Send real-time widget updates directly to DeviceDetails
     */
    broadcastWidgetUpdate(deviceId, widgets) {
        const message = {
            type: "WIDGET_UPDATE",
            deviceId,
            data: {
                widgets,
                timestamp: new Date().toISOString(),
            },
        };
        this.broadcastToSubscribers(deviceId, message);
    }
    broadcastToSubscribers(deviceId, message) {
        let subscriberCount = 0;
        for (const [clientId, client] of this.clients.entries()) {
            if (client.subscriptions.has(deviceId) &&
                client.ws.readyState === ws_1.WebSocket.OPEN) {
                try {
                    this.sendMessage(client.ws, message);
                    subscriberCount++;
                }
                catch (error) {
                    logger_1.default.error(`Error sending message to client ${clientId}`, {
                        error,
                    });
                    this.clients.delete(clientId);
                }
            }
        }
        if (subscriberCount > 0) {
            logger_1.default.info("Message broadcasted instantly", {
                deviceId,
                subscriberCount,
                type: message.type,
            });
        }
    }
    broadcastToAll(message) {
        for (const [clientId, client] of this.clients.entries()) {
            if (client.ws.readyState === ws_1.WebSocket.OPEN) {
                try {
                    this.sendMessage(client.ws, message);
                }
                catch (error) {
                    logger_1.default.error(`Error broadcasting to client ${clientId}`, { error });
                    this.clients.delete(clientId);
                }
            }
        }
    }
    sendMessage(ws, message) {
        if (ws.readyState === ws_1.WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
        }
    }
    sendError(ws, error) {
        this.sendMessage(ws, {
            type: "ERROR",
            error,
            timestamp: new Date().toISOString(),
        });
    }
    generateClientId() {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
    getConnectedClients() {
        return this.clients.size;
    }
    getDeviceSubscribers(deviceId) {
        return Array.from(this.clients.values()).filter((client) => client.subscriptions.has(deviceId)).length;
    }
    /**
     * Get enhanced stats including cache information
     */
    getStats() {
        const deviceSubscriptions = {};
        for (const client of this.clients.values()) {
            for (const deviceId of client.subscriptions) {
                deviceSubscriptions[deviceId] =
                    (deviceSubscriptions[deviceId] || 0) + 1;
            }
        }
        return {
            websocket: {
                totalClients: this.clients.size,
                deviceSubscriptions,
            },
            cache: this.deviceCache.getStats(),
        };
    }
    /**
     * Clean up resources
     */
    cleanup() {
        if (this.deviceCache) {
            this.deviceCache.cleanup();
        }
        for (const [clientId, client] of this.clients.entries()) {
            client.ws.close();
        }
        this.clients.clear();
        logger_1.default.info("WebSocket manager cleaned up");
    }
    async handleDeviceRefresh(clientId, deviceId) {
        try {
            const device = await this.deviceCache.getDevice(deviceId);
            if (device) {
                const client = this.clients.get(clientId);
                if (client) {
                    // Send fresh device data
                    this.sendMessage(client.ws, {
                        type: "DEVICE_REFRESH",
                        deviceId,
                        data: {
                            device: {
                                id: device.id,
                                name: device.name,
                                status: device.status,
                                lastPing: device.lastPing.toISOString(),
                            },
                            widgets: device.widgets,
                            timestamp: new Date().toISOString(),
                        },
                    });
                }
            }
        }
        catch (error) {
            logger_1.default.error("Failed to refresh device", { clientId, deviceId, error });
        }
    }
}
exports.default = WebSocketManager;
