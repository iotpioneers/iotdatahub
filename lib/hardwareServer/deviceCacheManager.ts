import logger from "./logger";
import config from "./config";
import prisma from "@/prisma/client";

export interface CachedDevice {
  id: string;
  token: string;
  name: string;
  status: "ONLINE" | "OFFLINE";
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
  private readonly UPDATE_DELAY = 5000; // 5 seconds
  private isInitialized = false;

  constructor() {
    this.startUpdateTimer();
  }

  /**
   * Initialize cache with user's devices and widgets
   */
  async initializeUserDevices(
    userId: string,
    organizationId: string,
  ): Promise<void> {
    try {
      logger.info("Initializing device cache", { userId, organizationId });

      // Fetch all devices for the user/organization
      const devicesResponse = await fetch(
        `${config.apiBaseUrl}/api/organizations/${organizationId}`,
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!devicesResponse.ok) {
        throw new Error(`Failed to fetch devices: ${devicesResponse.status}`);
      }

      const organizationData = await devicesResponse.json();

      // FIX: Extract devices from organization data
      // The organization object has a Device field that contains the array of devices
      const devicesData = organizationData.Device;

      // Validate that devicesData exists and is an array
      if (!devicesData) {
        logger.warn("No devices found in organization data", {
          organizationId,
        });
        this.isInitialized = true;
        return;
      }

      if (!Array.isArray(devicesData)) {
        throw new Error(
          `Expected devices to be an array, got: ${typeof devicesData}`,
        );
      }

      logger.info("Processing devices from organization", {
        deviceCount: devicesData.length,
        organizationId,
      });

      for (const deviceData of devicesData) {
        try {
          // Fetch widgets for each device
          const widgetsResponse = await fetch(
            `${config.apiBaseUrl}/api/devices/${deviceData.id}/widgets`,
            {
              headers: { "Content-Type": "application/json" },
            },
          );

          let widgets: CachedWidget[] = [];
          if (widgetsResponse.ok) {
            const widgetsData = await widgetsResponse.json();

            // Validate widgets data is an array
            if (Array.isArray(widgetsData)) {
              widgets = widgetsData.map((widget: any) => ({
                id: widget.id,
                deviceId: deviceData.id,
                pinConfig: widget.pinConfig || {
                  pinNumber:
                    widget.settings?.pinNumber?.toString().replace("V", "") ||
                    "0",
                  value: widget.value || widget.settings?.value || 0,
                  dataType: "FLOAT",
                },
                value:
                  widget.pinConfig?.value ||
                  widget.value ||
                  widget.settings?.value ||
                  0,
                lastUpdated: new Date(),
              }));
            } else {
              logger.warn("Widgets data is not an array", {
                deviceId: deviceData.id,
                widgetsType: typeof widgetsData,
              });
            }
          } else {
            logger.warn("Failed to fetch widgets", {
              deviceId: deviceData.id,
              status: widgetsResponse.status,
            });
          }

          // Validate device has required fields
          if (!deviceData.id || !deviceData.authToken) {
            logger.warn("Device missing required fields", {
              deviceId: deviceData.id,
              hasToken: !!deviceData.authToken,
            });
            continue;
          }

          // Create cached device
          const cachedDevice: CachedDevice = {
            id: deviceData.id,
            token: deviceData.authToken, // Note: using authToken, not token
            name: deviceData.name || "Unknown Device",
            status: deviceData.status || "OFFLINE",
            lastPing: deviceData.lastPing
              ? new Date(deviceData.lastPing)
              : new Date(),
            widgets,
            pinHistory: new Map(),
            metadata: deviceData.metadata,
          };

          // Store in cache
          this.devices.set(deviceData.id, cachedDevice);
          this.tokenToId.set(deviceData.authToken, deviceData.id);

          logger.info("Device cached", {
            deviceId: deviceData.id,
            deviceName: cachedDevice.name,
            widgetCount: widgets.length,
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
          // Continue with other devices
        }
      }

      this.isInitialized = true;
      logger.info("Device cache initialized successfully", {
        deviceCount: this.devices.size,
        userId,
        organizationId,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      logger.error("Failed to initialize device cache", {
        error: errorMessage,
        userId,
        organizationId,
      });
      throw error;
    }
  }

  /**
   * Get device ID from token (instant lookup)
   */
  getDeviceIdFromToken(token: string): string | null {
    return this.tokenToId.get(token) || null;
  }

  /**
   * Get cached device by ID
   */
  getDevice(deviceId: string): CachedDevice | null {
    return this.devices.get(deviceId) || null;
  }

  /**
   * Get cached device by token
   */
  getDeviceByToken(token: string): CachedDevice | null {
    const deviceId = this.getDeviceIdFromToken(token);
    return deviceId ? this.getDevice(deviceId) : null;
  }

  /**
   * Update device info in cache and queue for database update
   */
  updateDeviceInfo(
    token: string,
    updates: {
      status?: "ONLINE" | "OFFLINE";
      lastPing?: Date;
      metadata?: any;
      [key: string]: any;
    },
  ): void {
    const deviceId = this.getDeviceIdFromToken(token);
    if (!deviceId) {
      logger.warn("Device not found in cache for info update", {
        token: this.maskToken(token),
      });
      return;
    }

    const device = this.devices.get(deviceId);
    if (!device) return;

    // Update cache immediately
    Object.assign(device, updates);
    device.lastPing = updates.lastPing || new Date();

    // Queue for database update
    this.queueDeviceUpdate(deviceId, { device: updates });

    logger.debug("Device info updated in cache", {
      deviceId,
      updates: Object.keys(updates),
    });
  }

  /**
   * Update hardware data in cache and queue for database update
   */
  updateHardwareData(
    token: string,
    pin: number,
    value: string | number,
    command: string,
  ): { deviceId: string; updatedWidget: CachedWidget | null } | null {
    const deviceId = this.getDeviceIdFromToken(token);
    if (!deviceId) {
      logger.warn("Device not found in cache for hardware update", {
        token: this.maskToken(token),
        pin,
        value,
      });
      return null;
    }

    const device = this.devices.get(deviceId);
    if (!device) return null;

    const pinStr = pin.toString();

    // Update pin history
    const historyEntry: PinHistoryEntry = {
      pin: pinStr,
      value,
      timestamp: new Date(),
      command,
    };
    device.pinHistory.set(pinStr, historyEntry);

    // Find and update matching widget
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

    // Queue for database update
    this.queueDeviceUpdate(deviceId, {
      widgets: updatedWidget ? [updatedWidget] : [],
      pinHistory: [historyEntry],
    });

    logger.debug("Hardware data updated in cache", {
      deviceId,
      pin,
      value,
      command,
      widgetUpdated: !!updatedWidget,
    });

    return { deviceId, updatedWidget };
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
      // Merge updates
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
      // Create new batch
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

        // Re-queue failed updates for next cycle
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

    // Update device info if needed
    if (updates.device) {
      const response = await fetch(
        `${config.apiBaseUrl}/api/devices/${deviceId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: updates.device }),
        },
      );

      if (!response.ok) {
        throw new Error(`Device update failed: ${response.status}`);
      }
    }

    // Update widgets if needed
    if (updates.widgets && updates.widgets.length > 0) {
      for (const widget of updates.widgets) {
        const response = await fetch(
          `${config.apiBaseUrl}/api/widgets/${widget.id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              value: widget.value,
              pinConfig: widget.pinConfig,
            }),
          },
        );

        if (!response.ok) {
          logger.warn("Widget update failed", {
            widgetId: widget.id,
            status: response.status,
          });
        }
      }
    }

    // Store pin history if needed
    if (updates.pinHistory && updates.pinHistory.length > 0) {
      for (const entry of updates.pinHistory) {
        const response = await prisma.pinHistory.create({
          data: {
            deviceId,
            pinNumber: Number(entry.pin),
            value: entry.value.toString(),
            dataType: "STRING",
            timestamp: entry.timestamp,
          },
        });

        if (!response) {
          logger.warn("Pin history storage failed", {
            deviceId,
            pin: entry.pin,
            status: "Failed",
          });
        }
      }
    }

    logger.debug("Device updated in database", {
      deviceId,
      deviceUpdates: !!updates.device,
      widgetUpdates: updates.widgets?.length || 0,
      historyEntries: updates.pinHistory?.length || 0,
    });
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

    // Process any remaining updates
    this.processPendingUpdates().catch((error) => {
      logger.error("Error during cleanup update processing", { error });
    });

    logger.info("Device cache manager cleaned up");
  }
}

export default DeviceCacheManager;
