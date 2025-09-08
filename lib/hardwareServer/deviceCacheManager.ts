import { DeviceStatus } from "@prisma/client";
import logger from "./logger";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export interface CachedDevice {
  id: string;
  token: string;
  name: string;
  status: DeviceStatus;
  lastPing: Date;
  widgets: CachedWidget[];
  pinHistory: Map<string, PinHistoryEntry>;
  metadata?: any;
}

export interface CachedWidget {
  id: string;
  deviceId: string;
  pinConfig: {
    pinNumber: string;
    value: string | number;
    dataType: string;
  };
  value: string | number;
  lastUpdated: Date;
}

export interface PinHistoryEntry {
  pin: string;
  value: string | number;
  timestamp: Date;
  command: string;
}

export interface DeviceUpdateBatch {
  deviceId: string;
  updates: {
    device?: Partial<CachedDevice>;
    widgets?: CachedWidget[];
    pinHistory?: PinHistoryEntry[];
  };
  timestamp: Date;
}

class DeviceCacheManager {
  private devices: Map<string, CachedDevice> = new Map(); // deviceId -> device
  private tokenToId: Map<string, string> = new Map(); // token -> deviceId
  private pendingUpdates: Map<string, DeviceUpdateBatch> = new Map();
  private updateTimer: NodeJS.Timeout | null = null;
  private readonly UPDATE_DELAY = 2000; // 2 seconds instead of 5
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private readonly HEARTBEAT_TIMEOUT = 30000; // 30 seconds for online devices
  private readonly OFFLINE_TIMEOUT = 60000; // 60 seconds before marking offline
  private isInitialized = false;

  constructor() {
    this.startUpdateTimer();
    this.startHeartbeatMonitoring();
  }

  /**
   * Initialize cache with user's devices and widgets
   */
  async initializeUserDevices(
    userId: string,
    organizationId: string,
  ): Promise<void> {
    try {
      logger.info("Initializing device cache with Prisma", {
        userId,
        organizationId,
      });

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
        logger.warn("No devices found for user/organization", {
          userId,
          organizationId,
        });
        this.isInitialized = true;
        return;
      }

      logger.info("Processing devices from database", {
        deviceCount: devicesData.length,
        organizationId,
      });

      for (const deviceData of devicesData) {
        try {
          // Create cached device
          const cachedDevice = this.createCachedDevice(deviceData);

          // Store in cache
          this.devices.set(deviceData.id, cachedDevice);
          this.tokenToId.set(deviceData.authToken, deviceData.id);

          logger.info("Device cached", {
            deviceId: deviceData.id,
            deviceName: cachedDevice.name,
            widgetCount: cachedDevice.widgets.length,
            token: this.maskToken(deviceData.authToken),
          });
        } catch (deviceError) {
          logger.error("Failed to process device", {
            deviceId: deviceData.id,
            error:
              deviceError instanceof Error
                ? deviceError.message
                : "Unknown error",
          });
        }
      }

      this.isInitialized = true;
      logger.info("Device cache initialized successfully with Prisma", {
        deviceCount: this.devices.size,
        userId,
        organizationId,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to initialize device cache with Prisma", {
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
  private createCachedDevice(deviceData: any): CachedDevice {
    return {
      id: deviceData.id,
      token: deviceData.authToken,
      name: deviceData.name || "Unknown Device",
      status: deviceData.status || DeviceStatus.OFFLINE,
      lastPing: deviceData.lastPing || new Date(),
      widgets: deviceData.widgets.map((widget: any) => ({
        id: widget.id,
        deviceId: deviceData.id,
        pinConfig: {
          pinNumber:
            widget.pinNumber?.toString() ||
            (widget.settings as any)?.pinNumber?.toString().replace("V", "") ||
            "0",
          value: widget.value || (widget.settings as any)?.value || 0,
          dataType: "FLOAT",
        },
        value: widget.value || (widget.settings as any)?.value || 0,
        lastUpdated: widget.updatedAt,
      })),
      pinHistory: new Map(),
      metadata: deviceData.metadata,
    };
  }

  /**
   * Load device from database and add to cache
   */
  private async loadDeviceFromDatabase(
    token: string,
  ): Promise<CachedDevice | null> {
    try {
      logger.info("Loading device from database", {
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
        logger.warn("Device not found in database", {
          token: this.maskToken(token),
        });
        return null;
      }

      // Create cached device
      const cachedDevice = this.createCachedDevice(deviceData);

      // Add to cache
      this.devices.set(deviceData.id, cachedDevice);
      this.tokenToId.set(deviceData.authToken, deviceData.id);

      logger.info("Device loaded from database and cached", {
        deviceId: deviceData.id,
        deviceName: cachedDevice.name,
        widgetCount: cachedDevice.widgets.length,
        token: this.maskToken(token),
      });

      return cachedDevice;
    } catch (error) {
      logger.error("Failed to load device from database", {
        token: this.maskToken(token),
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return null;
    }
  }

  /**
   * Get device ID from token (with database fallback)
   */
  async getDeviceIdFromToken(token: string): Promise<string | null> {
    // First check cache
    const cachedId = this.tokenToId.get(token);
    if (cachedId) {
      return cachedId;
    }

    // Fallback to database
    logger.info("Device not found in cache, checking database", {
      token: this.maskToken(token),
    });

    const device = await this.loadDeviceFromDatabase(token);
    return device ? device.id : null;
  }

  /**
   * Get device ID from token (synchronous, cache only)
   */
  getDeviceIdFromTokenSync(token: string): string | null {
    return this.tokenToId.get(token) || null;
  }

  /**
   * Get cached device by ID (with database fallback)
   */
  async getDevice(deviceId: string): Promise<CachedDevice | null> {
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

      logger.info("Device loaded from database by ID and cached", {
        deviceId: deviceData.id,
        deviceName: cachedDevice.name,
        token: this.maskToken(deviceData.authToken),
      });

      return cachedDevice;
    } catch (error) {
      logger.error("Failed to load device by ID from database", {
        deviceId,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return null;
    }
  }

  /**
   * Get cached device by ID (synchronous, cache only)
   */
  getDeviceSync(deviceId: string): CachedDevice | null {
    return this.devices.get(deviceId) || null;
  }

  /**
   * Get cached device by token (with database fallback)
   */
  async getDeviceByToken(token: string): Promise<CachedDevice | null> {
    const deviceId = await this.getDeviceIdFromToken(token);
    return deviceId ? await this.getDevice(deviceId) : null;
  }

  /**
   * Get cached device by token (synchronous, cache only)
   */
  getDeviceByTokenSync(token: string): CachedDevice | null {
    const deviceId = this.getDeviceIdFromTokenSync(token);
    return deviceId ? this.getDeviceSync(deviceId) : null;
  }

  /**
   * Update device info in cache and queue for database update
   */
  async updateDeviceInfo(
    token: string,
    updates: {
      status?: "ONLINE" | "OFFLINE";
      lastPing?: Date;
      disconnectedAt?: Date;
      connectionCount?: number;
      metadata?: any;
      [key: string]: any;
    },
  ): Promise<void> {
    const deviceId = await this.getDeviceIdFromToken(token);
    if (!deviceId) {
      logger.warn("Device not found in cache or database for info update", {
        token: this.maskToken(token),
      });
      return;
    }

    const device = await this.getDevice(deviceId);
    if (!device) return;

    const wasOffline = device.status === "OFFLINE";
    Object.assign(device, updates);
    device.lastPing = updates.lastPing || new Date();

    if (!device.metadata) device.metadata = {};
    device.metadata.lastActivity = new Date();
    device.metadata.statusChangeTime = new Date();
    device.metadata.realTimeStatus = updates.status === "ONLINE";

    if (wasOffline && updates.status === "ONLINE") {
      logger.info("Device came back online", {
        deviceId,
        deviceName: device.name,
        downtime: device.metadata.disconnectedAt
          ? Math.round(
              (new Date().getTime() -
                new Date(device.metadata.disconnectedAt).getTime()) /
                1000,
            ) + "s"
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

    logger.debug("Device info updated in cache", {
      deviceId,
      updates: Object.keys(updates),
      status: updates.status,
    });
  }

  /**
   * Update hardware data in cache and queue for database update
   */
  async updateHardwareData(
    token: string,
    pin: number,
    value: string | number,
    command: string,
    isCmd20 = false,
  ): Promise<{ deviceId: string; updatedWidget: CachedWidget | null } | null> {
    const deviceId = await this.getDeviceIdFromToken(token);
    if (!deviceId) {
      logger.warn("Device not found in cache or database for hardware update", {
        token: this.maskToken(token),
        pin,
        value,
      });
      return null;
    }

    const device = await this.getDevice(deviceId);
    if (!device) {
      logger.error("Hardware update failed - device not found", {
        deviceToken: this.maskToken(token),
        pin,
        value,
      });
      return null;
    }

    const pinStr = pin.toString();

    device.lastPing = new Date();
    device.status = "ONLINE"; // Ensure device is marked online when receiving data
    if (!device.metadata) device.metadata = {};
    device.metadata.lastActivity = new Date();
    device.metadata.statusChangeTime = new Date();
    device.metadata.realTimeStatus = true;

    const historyEntry: PinHistoryEntry = {
      pin: pinStr,
      value,
      timestamp: new Date(),
      command,
    };
    device.pinHistory.set(pinStr, historyEntry);

    let updatedWidget: CachedWidget | null = null;
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

      logger.info("CMD:20 - Immediate database sync completed", {
        deviceId,
        pin,
        value,
        updateTime: new Date().toISOString(),
      });
    } else {
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

    logger.debug("Hardware data updated in cache", {
      deviceId,
      pin,
      value,
      command,
      isCmd20,
      widgetUpdated: !!updatedWidget,
    });

    return { deviceId, updatedWidget };
  }

  private async updateDeviceInDatabaseImmediate(
    deviceId: string,
    updates: DeviceUpdateBatch["updates"],
  ): Promise<void> {
    try {
      if (updates.device) {
        const { widgets, pinHistory, ...deviceOnlyUpdates } = updates.device;

        const dbUpdateData: any = {};
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

      logger.info("Immediate database update completed", {
        deviceId,
        widgetUpdates: updates.widgets?.length || 0,
        historyEntries: updates.pinHistory?.length || 0,
      });
    } catch (error) {
      logger.error("Immediate database update failed", {
        deviceId,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  }

  async getDeviceLastActivity(token: string): Promise<Date | null> {
    const deviceId = await this.getDeviceIdFromToken(token);
    if (!deviceId) return null;

    const device = await this.getDevice(deviceId);
    if (!device) return null;

    return device.metadata?.lastActivity || device.lastPing;
  }

  /**
   * Queue device updates for batch processing
   */
  private queueDeviceUpdate(
    deviceId: string,
    updates: DeviceUpdateBatch["updates"],
  ): void {
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
    } else {
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
  private startUpdateTimer(): void {
    this.updateTimer = setInterval(async () => {
      await this.processPendingUpdates();
    }, this.UPDATE_DELAY);

    logger.info("Device cache update timer started", {
      updateDelayMs: this.UPDATE_DELAY,
    });
  }

  /**
   * Process all pending updates to database
   */
  private async processPendingUpdates(): Promise<void> {
    if (this.pendingUpdates.size === 0) return;

    const updates = Array.from(this.pendingUpdates.values());
    this.pendingUpdates.clear();

    logger.info("Processing pending device updates", {
      batchCount: updates.length,
    });

    for (const batch of updates) {
      try {
        await this.updateDeviceInDatabase(batch);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        logger.error("Failed to update device in database", {
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
  private async updateDeviceInDatabase(
    batch: DeviceUpdateBatch,
  ): Promise<void> {
    const { deviceId, updates } = batch;

    try {
      if (updates.device) {
        const { widgets, pinHistory, ...deviceOnlyUpdates } = updates.device;

        const dbUpdateData: any = {};
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

      logger.debug("Device updated in database via Prisma", {
        deviceId,
        deviceUpdates: !!updates.device,
        widgetUpdates: updates.widgets?.length || 0,
        historyEntries: updates.pinHistory?.length || 0,
      });
    } catch (error) {
      logger.error("Failed to update device in database via Prisma", {
        deviceId,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  }

  /**
   * Get all cached devices
   */
  getAllDevices(): CachedDevice[] {
    return Array.from(this.devices.values());
  }

  /**
   * Check if cache is initialized
   */
  isReady(): boolean {
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
  private maskToken(token: string): string {
    return token && token.length > 8
      ? `${token.substring(0, 4)}...${token.substring(token.length - 4)}`
      : "****";
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = null;
    }

    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    this.processPendingUpdates().catch((error) => {
      logger.error("Error during cleanup update processing", { error });
    });

    logger.info("Device cache manager cleaned up");
  }

  private startHeartbeatMonitoring(): void {
    this.heartbeatTimer = setInterval(async () => {
      await this.checkDeviceHeartbeats();
    }, 10000); // Check every 10 seconds

    logger.info("Device heartbeat monitoring started", {
      checkIntervalMs: 10000,
      heartbeatTimeoutMs: this.HEARTBEAT_TIMEOUT,
      offlineTimeoutMs: this.OFFLINE_TIMEOUT,
    });
  }

  private async checkDeviceHeartbeats(): Promise<void> {
    const now = new Date();
    const devicesUpdated: string[] = [];

    for (const [deviceId, device] of this.devices) {
      const timeSinceLastPing = now.getTime() - device.lastPing.getTime();
      const wasOnline = device.status === "ONLINE";

      if (wasOnline && timeSinceLastPing > this.HEARTBEAT_TIMEOUT) {
        device.status = "OFFLINE";
        if (!device.metadata) device.metadata = {};
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
        logger.info("Device marked offline due to heartbeat timeout", {
          deviceId,
          deviceName: device.name,
          timeSinceLastPing: Math.round(timeSinceLastPing / 1000) + "s",
        });
      }
    }

    if (devicesUpdated.length > 0) {
      logger.info("Heartbeat check completed", {
        devicesChecked: this.devices.size,
        devicesUpdated: devicesUpdated.length,
        offlineDevices: devicesUpdated,
      });
    }
  }
}

export default DeviceCacheManager;
