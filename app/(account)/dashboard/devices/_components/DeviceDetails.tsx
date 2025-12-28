"use client";

import { useEffect, useState, useCallback } from "react";
import DeviceConfigurationModal from "./DeviceConfigurationModal";
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
  const [showModal, setShowModal] = useState(false);
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

  const { data: session, status } = useSession();

  const {
    data: deviceData,
    isLoading,
    error,
    refetch: refetchDevice,
  } = useFetch(`/api/devices/${params.id}`);

  const { data: organizationData } = useFetch(
    `/api/organizations/${session?.user?.organizationId}`
  );

  const { data: initialWidgetData, refetch: refetchWidgets } = useFetch(
    `/api/devices/${params.id}/widgets`
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
                : null
            );

            break;

          case "HARDWARE_DATA":
            const isCmd20 = message.data.isCmd20 || message.priority === "HIGH";
            const updateTime = performance.now() - updateStartTime;

            if (isCmd20) {
              setRealTimeStats((prev) => ({
                ...prev,
                cmd20Count: prev.cmd20Count + 1,
                lastCmd20: new Date(),
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
                    lastUpdated: new Date(),
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

            break;

          case "WIDGET_UPDATE":
            setWidgetData(message.data.widgets);
            break;

          case "DEVICE_STATUS":
            setDevice((prevDevice) =>
              prevDevice
                ? {
                    ...prevDevice,
                    status: message.data.status,
                    lastPing: message.data.lastPing,
                    metadata: {
                      ...prevDevice.metadata,
                      realTimeStatus: message.data.realTime || true,
                      lastActivity: new Date(),
                      statusChangeTime: new Date(),
                    },
                  }
                : null
            );

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
    [params.id]
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

  const handleManualRefresh = async () => {
    if (cacheReady && isConnected) {
      sendMessage({
        type: "REFRESH_DEVICE",
        deviceId: params.id,
      });
    } else {
      await Promise.all([refetchDevice(), refetchWidgets()]);
    }
  };

  useEffect(() => {
    if (!isConnected || !cacheReady) {
      const pollInterval = setInterval(() => {
        handleManualRefresh();
      }, 8000);

      return () => clearInterval(pollInterval);
    } else if (device?.status === "ONLINE") {
      const heartbeatInterval = setInterval(() => {
        sendMessage({
          type: "DEVICE_HEARTBEAT",
          deviceId: params.id,
          timestamp: new Date().toISOString(),
        });
      }, 3000);

      return () => clearInterval(heartbeatInterval);
    }
  }, [isConnected, cacheReady, device?.status, params.id, sendMessage]);

  if (error) {
    return (
      <Box className="text-red-500">
        {error || "There was an error while fetching the device"}
      </Box>
    );
  }

  const channel = organization?.Channel?.find(
    (channel: Channel) => channel.id === device?.channelId
  );
  const apiKey = organization?.ApiKey?.find(
    (key: ApiKey) => key.channelId === channel?.id
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

  const getDeviceStatusDisplay = () => {
    if (!device)
      return { icon: HiStatusOffline, color: "text-gray-500", text: "Unknown" };

    const isRealTimeOnline =
      device.status === "ONLINE" && device.metadata?.realTimeStatus;
    const timeSinceLastPing = device.lastPing
      ? new Date().getTime() - new Date(device.lastPing).getTime()
      : Number.POSITIVE_INFINITY;

    const onlineThreshold = isRealTimeOnline ? 15000 : 45000;
    const isActuallyOnline =
      device.status === "ONLINE" && timeSinceLastPing < onlineThreshold;

    if (isActuallyOnline) {
      return {
        icon: HiStatusOnline,
        color: isRealTimeOnline ? "text-green-500" : "text-yellow-500",
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

      <DeviceConfigurationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        userName={session?.user?.name}
        organizationName={organization?.name}
        deviceToken={device?.authToken}
      />
    </div>
  );
};

export default DeviceDetails;
