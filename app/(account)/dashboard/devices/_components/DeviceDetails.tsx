"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import DeviceConfigurationModal from "./DeviceConfigurationModal";
import DeviceHintModal from "./DeviceHintModal";
import { Box } from "@mui/material";
import useFetch from "@/hooks/useFetch";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useSession } from "next-auth/react";
import type { ApiKey, Channel, Device } from "@/types";
import { LinearLoading } from "@/components/LinearLoading";
import { HiStatusOffline, HiStatusOnline } from "react-icons/hi";
import Link from "next/link";
import WidgetGrid from "@/components/Channels/dashboard/widgets/WidgetGrid";
import type { WebSocketMessage } from "@/types/websocket";

interface Props {
  params: { id: string };
}

interface Organization {
  id: string;
  name: string;
  areaOfInterest: string[];
  Channel: Channel[];
  ApiKey: ApiKey[];
}

const DeviceDetails = ({ params }: Props) => {
  const [showModal, setShowModal] = useState(() => {
    if (typeof window !== "undefined") {
      return !localStorage.getItem(`device-config-${params.id}`);
    }
    return true;
  });
  const [hintStep, setHintStep] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(`device-hint-${params.id}`) ? 0 : 1;
    }
    return 0;
  });
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [device, setDevice] = useState<Device | null>(null);
  const [widgetData, setWidgetData] = useState<any[]>([]);
  const [realTimeStats, setRealTimeStats] = useState({
    updateCount: 0,
    cmd20Count: 0,
    lastCmd20: null as Date | null,
    avgUpdateTime: 0,
    fastestUpdate: Number.POSITIVE_INFINITY,
  });

  // NEW: Track last data activity from PinHistory
  const [lastDataActivity, setLastDataActivity] = useState<Date | null>(null);
  const [deviceOnlineStatus, setDeviceOnlineStatus] = useState<
    "ONLINE" | "OFFLINE"
  >("OFFLINE");
  const statusTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const statusLockRef = useRef<boolean>(false);

  const { data: session, status } = useSession();

  const {
    data: deviceData,
    isLoading,
    error,
    refetch: refetchDevice,
  } = useFetch(`/api/devices/${params.id}`);

  const { data: organizationData } = useFetch(
    `/api/organizations/${session?.user?.organizationId}`,
  );

  const { data: initialWidgetData, refetch: refetchWidgets } = useFetch(
    `/api/devices/${params.id}/widgets`,
  );

  // NEW: Function to check recent data from PinHistory
  const checkRecentDataActivity = useCallback(async () => {
    try {
      const response = await fetch(`/api/devices/${params.id}/history/recent`);
      if (response.ok) {
        const data = await response.json();
        if (data.lastActivity) {
          const lastActivity = new Date(data.lastActivity);
          setLastDataActivity(lastActivity);

          // If we have recent data (within 10 seconds), device is online
          const timeSinceLastData = Date.now() - lastActivity.getTime();
          if (timeSinceLastData < 10000) {
            return true;
          }
        }
      }
      return false;
    } catch (error) {
      console.error("Error checking recent data activity:", error);
      return false;
    }
  }, [params.id]);

  // NEW: Improved status management with locking mechanism
  const updateDeviceStatus = useCallback(
    (newStatus: "ONLINE" | "OFFLINE", source: string) => {
      console.log(
        `[Status Update] Source: ${source}, New Status: ${newStatus}, Locked: ${statusLockRef.current}`,
      );

      if (newStatus === "ONLINE") {
        // When going online, lock the status for 10 seconds
        statusLockRef.current = true;
        setDeviceOnlineStatus("ONLINE");

        // Clear any existing timeout
        if (statusTimeoutRef.current) {
          clearTimeout(statusTimeoutRef.current);
        }

        // Set timeout to unlock and re-check status after 10 seconds
        statusTimeoutRef.current = setTimeout(async () => {
          console.log(
            "[Status] 10-second lock expired, checking recent data...",
          );
          const hasRecentData = await checkRecentDataActivity();

          if (!hasRecentData) {
            console.log("[Status] No recent data, setting to OFFLINE");
            setDeviceOnlineStatus("OFFLINE");
          } else {
            console.log("[Status] Recent data found, staying ONLINE");
          }

          statusLockRef.current = false;
        }, 10000);
      } else if (!statusLockRef.current) {
        // Only allow offline status if not locked
        setDeviceOnlineStatus("OFFLINE");
      }
    },
    [checkRecentDataActivity],
  );

  const handleWebSocketMessage = useCallback(
    (message: WebSocketMessage) => {
      const updateStartTime = performance.now();

      if (message.deviceId && message.deviceId === params.id) {
        switch (message.type) {
          case "DEVICE_UPDATE":
            setDevice((prevDevice) =>
              prevDevice
                ? {
                    ...prevDevice,
                    ...message.data,
                    metadata: {
                      ...prevDevice.metadata,
                      realTimeStatus: true,
                      lastActivity: new Date(),
                    },
                  }
                : null,
            );

            // Data received, mark as online
            updateDeviceStatus("ONLINE", "DEVICE_UPDATE");
            break;

          case "HARDWARE_DATA":
            const isCmd20 = message.data.isCmd20 || message.priority === "HIGH";
            const updateTime = performance.now() - updateStartTime;

            // NEW: Update last data activity timestamp
            const now = new Date();
            setLastDataActivity(now);
            updateDeviceStatus("ONLINE", "HARDWARE_DATA");

            if (isCmd20) {
              setRealTimeStats((prev) => ({
                ...prev,
                cmd20Count: prev.cmd20Count + 1,
                lastCmd20: now,
              }));
            }

            setWidgetData((prevWidgets) => {
              return prevWidgets.map((widget) => {
                const widgetPin =
                  widget.pinConfig?.pinNumber?.toString() ||
                  widget.settings?.pinNumber?.toString();
                const messagePin = message.data.pin.toString();

                if (
                  widgetPin === messagePin ||
                  widgetPin === `V${messagePin}`
                ) {
                  return {
                    ...widget,
                    value: message.data.value,
                    pinConfig: {
                      ...widget.pinConfig,
                      value: message.data.value,
                    },
                    settings: {
                      ...widget.settings,
                      value: message.data.value,
                    },
                    lastUpdated: now,
                    isCmd20Update: isCmd20,
                    instantUpdate: true,
                    updateTime: updateTime,
                  };
                }
                return widget;
              });
            });

            setRealTimeStats((prev) => ({
              ...prev,
              updateCount: prev.updateCount + 1,
              avgUpdateTime:
                (prev.avgUpdateTime * prev.updateCount + updateTime) /
                (prev.updateCount + 1),
              fastestUpdate: Math.min(prev.fastestUpdate, updateTime),
            }));

            break;

          case "WIDGET_STATE_SYNC":
            setWidgetData((prevWidgets) => {
              return prevWidgets.map((widget) => {
                if (widget.id === message.data.widgetId) {
                  return {
                    ...widget,
                    value: message.data.value,
                    pinConfig: {
                      ...widget.pinConfig,
                      value: message.data.value,
                    },
                    settings: {
                      ...widget.settings,
                      value: message.data.value,
                    },
                    lastUpdated: new Date(),
                    forcedUpdate: true,
                  };
                }
                return widget;
              });
            });

            updateDeviceStatus("ONLINE", "WIDGET_STATE_SYNC");
            break;

          case "WIDGET_UPDATE":
            setWidgetData(message.data.widgets);
            break;

          case "DEVICE_STATUS":
            const statusFromMessage = message.data.status;
            setDevice((prevDevice) =>
              prevDevice
                ? {
                    ...prevDevice,
                    status: statusFromMessage,
                    lastPing: message.data.lastPing,
                    metadata: {
                      ...prevDevice.metadata,
                      realTimeStatus: message.data.realTime || true,
                      lastActivity: new Date(),
                      statusChangeTime: new Date(),
                    },
                  }
                : null,
            );

            // Update our managed status
            if (statusFromMessage === "ONLINE") {
              updateDeviceStatus("ONLINE", "DEVICE_STATUS");
            }
            break;

          case "DEVICE_REFRESH":
            if (message.data.device) {
              setDevice((prevDevice) => ({
                ...prevDevice,
                ...message.data.device,
              }));
            }
            if (message.data.widgets) {
              setWidgetData(message.data.widgets);
            }
            break;

          case "CACHE_INITIALIZED":
            break;
        }
      }
    },
    [params.id, updateDeviceStatus],
  );

  const { isConnected, cacheReady, sendMessage } = useWebSocket({
    deviceId: params.id,
    onMessage: handleWebSocketMessage,
    enabled: !!session && status === "authenticated",
  });

  useEffect(() => {
    if (deviceData) setDevice(deviceData);
    if (organizationData) setOrganization(organizationData);
    if (initialWidgetData) setWidgetData(initialWidgetData);
  }, [deviceData, organizationData, initialWidgetData]);

  useEffect(() => {
    if (isConnected && session?.user?.organizationId && !cacheReady) {
      sendMessage({
        type: "INITIALIZE_CACHE",
        userId: session.user.id,
        organizationId: session.user.organizationId,
      });
    }
  }, [isConnected, session, cacheReady, sendMessage]);

  // NEW: Initial check for recent data on mount
  useEffect(() => {
    checkRecentDataActivity();
  }, [params.id]);

  // NEW: Periodic check for data activity every 5 seconds (only when not connected to WebSocket)
  useEffect(() => {
    if (isConnected && cacheReady) {
      // WebSocket is handling data - don't poll
      return;
    }

    const interval = setInterval(() => {
      if (!statusLockRef.current) {
        checkRecentDataActivity();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isConnected, cacheReady, params.id]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (statusTimeoutRef.current) {
        clearTimeout(statusTimeoutRef.current);
      }
    };
  }, []);

  const handleHintNext = () => {
    if (hintStep === 1) {
      setShowModal(false);
      setHintStep(2);
    } else {
      setHintStep(0);
      localStorage.setItem(`device-hint-${params.id}`, "completed");
    }
  };

  const handleHintClose = () => {
    setHintStep(0);
    localStorage.setItem(`device-hint-${params.id}`, "completed");
  };

  const handleManualRefresh = useCallback(async () => {
    if (cacheReady && isConnected) {
      sendMessage({
        type: "REFRESH_DEVICE",
        deviceId: params.id,
      });
    } else {
      // Only fetch when explicitly refreshed or polling
      try {
        await refetchDevice();
        await refetchWidgets();
      } catch (err) {
        console.error("Error refreshing device data:", err);
      }
    }
  }, [
    cacheReady,
    isConnected,
    params.id,
    sendMessage,
    refetchDevice,
    refetchWidgets,
  ]);

  useEffect(() => {
    // Only poll via API when WebSocket is not ready
    if (!isConnected || !cacheReady) {
      const pollInterval = setInterval(() => {
        handleManualRefresh();
      }, 15000); // Increased from 8000 to 15000ms to reduce API load

      return () => clearInterval(pollInterval);
    }
    // When WebSocket is connected, no polling needed - WebSocket will push updates
  }, [isConnected, cacheReady, handleManualRefresh]);

  if (error) {
    return (
      <Box className="text-red-500">
        {error || "There was an error while fetching the device"}
      </Box>
    );
  }

  const channel = organization?.Channel?.find(
    (channel: Channel) => channel.id === device?.channelId,
  );
  const apiKey = organization?.ApiKey?.find(
    (key: ApiKey) => key.channelId === channel?.id,
  );

  const getConnectionStatus = () => {
    if (isConnected && cacheReady) {
      const avgTime = realTimeStats.avgUpdateTime.toFixed(1);
      const fastestTime =
        realTimeStats.fastestUpdate === Number.POSITIVE_INFINITY
          ? "N/A"
          : realTimeStats.fastestUpdate.toFixed(1);
      return {
        color: "bg-green-500",
        text: `Real-time (${avgTime}ms avg, ${fastestTime}ms fastest)`,
      };
    } else if (isConnected) {
      return { color: "bg-yellow-500", text: "Connected, initializing cache" };
    } else {
      return { color: "bg-red-500", text: "Using API polling" };
    }
  };

  const connectionStatus = getConnectionStatus();

  // NEW: Improved device status display with real-time data checking
  const getDeviceStatusDisplay = () => {
    if (!device)
      return { icon: HiStatusOffline, color: "text-gray-500", text: "Unknown" };

    // Use our managed status instead of database status
    const isActuallyOnline = deviceOnlineStatus === "ONLINE";

    // Additional check: if we have recent data activity, prioritize that
    if (lastDataActivity) {
      const timeSinceLastData = Date.now() - lastDataActivity.getTime();
      if (timeSinceLastData < 10000) {
        // Data within last 10 seconds
        return {
          icon: HiStatusOnline,
          color: "text-green-500",
          text: "ONLINE",
        };
      }
    }

    if (isActuallyOnline) {
      return {
        icon: HiStatusOnline,
        color: "text-green-500",
        text: "ONLINE",
      };
    } else {
      return {
        icon: HiStatusOffline,
        color: "text-red-500",
        text: "OFFLINE",
      };
    }
  };

  const deviceStatusDisplay = getDeviceStatusDisplay();

  return (
    <div className="min-h-screen">
      {(isLoading ||
        !deviceData ||
        isRedirecting ||
        !device ||
        !organization ||
        !channel ||
        !apiKey ||
        status === "loading" ||
        status === "unauthenticated" ||
        !session) && <LinearLoading />}

      <div className="bg-white rounded-lg shadow-sm p-1 mb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-8 h-8 text-orange-50"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <rect
                  x="4"
                  y="4"
                  width="16"
                  height="16"
                  rx="2"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-semibold text-orange-50">
                  {device?.name || ""}
                </h1>
                <span className="flex items-center">
                  <deviceStatusDisplay.icon
                    className={`${deviceStatusDisplay.color} mr-2 animate-pulse`}
                  />
                  <strong className="font-bold">
                    {deviceStatusDisplay.text}
                  </strong>
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-500">
                <span>
                  Owner:{" "}
                  <strong className="font-bold"> {session?.user?.name}</strong>
                </span>
                <span>•</span>
                <span>
                  Organization:{" "}
                  <strong className="font-bold">
                    {organization?.name || ""}
                  </strong>
                </span>
                <button
                  id="edit-button"
                  className="px-4 py-2 bg-orange-50 text-white rounded-lg hover:bg-green-600 font-medium"
                  onClick={() => setIsRedirecting(true)}
                >
                  <Link href={`/dashboard/devices/${params.id}/edit`}>
                    {isRedirecting || !deviceData ? <LinearLoading /> : "Edit"}
                  </Link>
                </button>
                <button
                  onClick={handleManualRefresh}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Refresh
                </button>
                <button
                  id="config-button"
                  onClick={() => setShowModal(true)}
                  className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 rounded-md transition-colors"
                >
                  Config
                </button>
              </div>
            </div>
          </div>
        </div>

        {!widgetData || widgetData.length === 0 ? (
          <div className="flex items-center justify-center h-96 border-2 border-dashed border-gray-200 rounded-lg">
            <div className="text-center">
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-orange-50">
                No Dashboard widgets
              </h3>
              {!cacheReady && (
                <p className="text-sm text-gray-500 mt-2">
                  Cache is initializing... Widgets will appear once ready.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-md">
            <WidgetGrid deviceId={params.id} widgets={widgetData} />
          </div>
        )}
      </div>

      {hintStep > 0 && (
        <DeviceHintModal
          step={hintStep}
          onNext={handleHintNext}
          onClose={handleHintClose}
        />
      )}

      <DeviceConfigurationModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          localStorage.setItem(`device-config-${params.id}`, "seen");
        }}
        userName={session?.user?.name}
        organizationName={organization?.name}
        deviceToken={device?.authToken}
      />
    </div>
  );
};

export default DeviceDetails;
