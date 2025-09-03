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
        logger_1.default.info("WebSocket server initialized with device cache");
    }
    handleConnection(ws, req) {
        const clientId = this.generateClientId();
        const client = {
            ws,
            subscriptions: new Set(),
        };
        this.clients.set(clientId, client);
        console.log("====================================");
        console.log(`📌 WebSocket CLIENT CONNECTED: ${clientId}`);
        console.log(`   Total clients: ${this.clients.size}`);
        console.log(`   Cache ready: ${this.deviceCache.isReady()}`);
        console.log("====================================");
        ws.on("message", (data) => {
            try {
                const message = JSON.parse(data.toString());
                this.handleMessage(clientId, message);
            }
            catch (error) {
                console.error("Invalid WebSocket message:", error);
                this.sendError(ws, "Invalid message format");
            }
        });
        ws.on("close", () => {
            this.clients.delete(clientId);
            console.log("====================================");
            console.log(`📌 WebSocket CLIENT DISCONNECTED: ${clientId}`);
            console.log(`   Remaining clients: ${this.clients.size}`);
            console.log("====================================");
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
        console.log("====================================");
        console.log(`📨 WebSocket MESSAGE from ${clientId}:`, message.type);
        console.log("====================================");
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
                    console.log(`✅ Client ${clientId} subscribed to device ${message.deviceId}`);
                }
                break;
            case "UNSUBSCRIBE_DEVICE":
                if (message.deviceId) {
                    client.subscriptions.delete(message.deviceId);
                    console.log(`❌ Client ${clientId} unsubscribed from device ${message.deviceId}`);
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
            console.log("====================================");
            console.log("🚀 DEVICE CACHE INITIALIZED");
            console.log(`   User ID: ${userId}`);
            console.log(`   Organization ID: ${organizationId}`);
            console.log(`   Devices cached: ${this.deviceCache.getStats().deviceCount}`);
            console.log("====================================");
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
    async broadcastHardwareUpdate(deviceToken, pin, value, command) {
        if (!this.wss)
            return;
        // INSTANT lookup from cache - no API call!
        const result = await this.deviceCache.updateHardwareData(deviceToken, pin, value, command);
        if (result) {
            const { deviceId, updatedWidget } = result;
            const update = {
                deviceId,
                pin,
                value,
                timestamp: new Date().toISOString(),
                command,
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
            };
            console.log("====================================");
            console.log(`🚀 INSTANT HARDWARE UPDATE BROADCAST`);
            console.log(`   Device: ${deviceId}`);
            console.log(`   Pin: ${pin}, Value: ${value}`);
            console.log(`   Widget updated: ${!!updatedWidget}`);
            console.log(`   Subscribers: ${this.getDeviceSubscribers(deviceId)}`);
            console.log("====================================");
            this.broadcastToSubscribers(deviceId, message);
            // Update device status to ONLINE
            this.deviceCache.updateDeviceInfo(deviceToken, {
                status: "ONLINE",
                lastPing: new Date(),
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
    /**
     * Broadcast device status updates (using cache)
     */
    async broadcastDeviceStatus(deviceToken, status, lastPing) {
        if (!this.wss)
            return;
        // Update in cache first
        this.deviceCache.updateDeviceInfo(deviceToken, {
            status: status,
            lastPing: lastPing || new Date(),
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
}
exports.default = WebSocketManager;
