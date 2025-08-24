"use client";

import React, { useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";
import { Box } from "@mui/material";
import useFetch from "@/hooks/useFetch";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useSession } from "next-auth/react";
import { ApiKey, Channel, Device } from "@/types";
import { LinearLoading } from "@/components/LinearLoading";
import { HiStatusOffline, HiStatusOnline } from "react-icons/hi";
import Link from "next/link";
import WidgetGrid from "@/components/Channels/dashboard/widgets/WidgetGrid";
import { WebSocketMessage } from "@/types/websocket";

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
  const [showModal, setShowModal] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [device, setDevice] = useState<Device | null>(null);
  const [widgetData, setWidgetData] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [cacheInitialized, setCacheInitialized] = useState(false);

  const { data: session, status } = useSession();

  // Enhanced WebSocket message handler for cache-based updates
  const handleWebSocketMessage = useCallback(
    (message: WebSocketMessage) => {
      console.log("Received WebSocket message:", message);

      // Only handle messages for this specific device
      if (message.deviceId && message.deviceId === params.id) {
        switch (message.type) {
          case "DEVICE_UPDATE":
            // Update device data
            setDevice((prevDevice) =>
              prevDevice
                ? {
                    ...prevDevice,
                    ...message.data,
                  }
                : null,
            );
            setLastUpdate(new Date());
            break;

          case "HARDWARE_DATA":
            console.log("INSTANT hardware data update received:", message.data);

            // Update widget data with new hardware values (INSTANT UPDATE)
            setWidgetData((prevWidgets) => {
              return prevWidgets.map((widget) => {
                if (
                  widget.pinConfig?.pinNumber === message.data.pin.toString()
                ) {
                  console.log(
                    `Updating widget for pin ${message.data.pin} with value:`,
                    message.data.value,
                  );
                  return {
                    ...widget,
                    value: message.data.value,
                    pinConfig: {
                      ...widget.pinConfig,
                      value: message.data.value,
                    },
                  };
                }
                return widget;
              });
            });
            setLastUpdate(new Date());
            break;

          case "WIDGET_UPDATE":
            // Direct widget updates from cache
            console.log("Widget update from cache:", message.data);
            setWidgetData(message.data.widgets);
            setLastUpdate(new Date());
            break;

          case "DEVICE_STATUS":
            // Update device status
            setDevice((prevDevice) =>
              prevDevice
                ? {
                    ...prevDevice,
                    status: message.data.status,
                    lastPing: message.data.lastPing,
                  }
                : null,
            );
            setLastUpdate(new Date());
            break;

          case "CACHE_INITIALIZED":
            console.log("Device cache initialized:", message.stats);
            setCacheInitialized(true);
            setLastUpdate(new Date());
            break;
        }
      }

      // Handle global cache status messages
      if (message.type === "CONNECTION_ESTABLISHED") {
        setCacheInitialized(message.cacheReady || false);
        console.log("WebSocket connected. Cache ready:", message.cacheReady);
      }
    },
    [params.id],
  );

  const {
    isConnected,
    error: wsError,
    sendMessage,
  } = useWebSocket({
    deviceId: params.id,
    onMessage: handleWebSocketMessage,
    enabled: !!session && status === "authenticated",
  });

  if (status === "loading" || status === "unauthenticated" || !session) {
    return <LinearLoading />;
  }

  const {
    data: deviceData,
    isLoading,
    error,
    refetch: refetchDevice,
  } = useFetch(`/api/devices/${params.id}`);

  const { data: organizationData } = useFetch(
    `/api/organizations/${session.user.organizationId}`,
  );

  const { data: initialWidgetData, refetch: refetchWidgets } = useFetch(
    `/api/devices/${params.id}/widgets`,
  );

  // Initialize cache when WebSocket connects
  useEffect(() => {
    if (isConnected && session?.user?.organizationId && !cacheInitialized) {
      console.log("Requesting cache initialization...");
      sendMessage({
        type: "INITIALIZE_CACHE",
        userId: session.user.id,
        organizationId: session.user.organizationId,
      });
    }
  }, [isConnected, session, cacheInitialized, sendMessage]);

  // Manual refresh function (now works with cache)
  const handleManualRefresh = async () => {
    console.log("Manual refresh triggered");

    if (cacheInitialized && isConnected) {
      // If cache is ready, just request fresh data via WebSocket
      sendMessage({
        type: "REFRESH_DEVICE",
        deviceId: params.id,
      });
    } else {
      // Fallback to API refresh
      await Promise.all([refetchDevice(), refetchWidgets()]);
    }

    setLastUpdate(new Date());
  };

  useEffect(() => {
    if (deviceData) setDevice(deviceData);
    if (organizationData) setOrganization(organizationData);
    if (initialWidgetData) setWidgetData(initialWidgetData);
  }, [deviceData, organizationData, initialWidgetData]);

  // Enhanced fallback: Only poll if WebSocket is not connected AND cache is not ready
  useEffect(() => {
    if (!isConnected || !cacheInitialized) {
      const pollInterval = setInterval(() => {
        console.log("Polling for updates (WebSocket/Cache not ready)");
        handleManualRefresh();
      }, 10000); // Poll every 10 seconds

      return () => clearInterval(pollInterval);
    }
  }, [isConnected, cacheInitialized]);

  if (error) {
    console.error("Error fetching device:", error);
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

  if (!device || !organization || !channel || !apiKey) {
    return <LinearLoading />;
  }

  // Connection status logic
  const getConnectionStatus = () => {
    if (isConnected && cacheInitialized) {
      return { color: "bg-green-500", text: "Real-time with cache" };
    } else if (isConnected) {
      return { color: "bg-yellow-500", text: "Connected, initializing cache" };
    } else {
      return { color: "bg-red-500", text: "Using API polling" };
    }
  };

  const connectionStatus = getConnectionStatus();

  return (
    <div className="min-h-screen px-4">
      {(isLoading || !deviceData || isRedirecting) && <LinearLoading />}

      {/* Enhanced Connection Status Indicator */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span
            className={`w-2 h-2 rounded-full ${connectionStatus.color}`}
          ></span>
          <span>{connectionStatus.text}</span>
          <span>•</span>
          <span>Last update: {lastUpdate.toLocaleTimeString()}</span>
          {cacheInitialized && (
            <>
              <span>•</span>
              <span className="text-green-600 font-medium">Cache Active</span>
            </>
          )}
        </div>
        <button
          onClick={handleManualRefresh}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Performance Indicator */}
      {cacheInitialized && isConnected && (
        <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center space-x-2 text-sm text-green-700">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium">High Performance Mode Active</span>
            <span>- Instant hardware updates, no database delays</span>
          </div>
        </div>
      )}

      {/* Main Dashboard Container */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
        {/* Header */}
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
                  {device.name}
                </h1>
                <span className="flex items-center">
                  {device.status === "OFFLINE" ? (
                    <HiStatusOffline className="text-red-500 mr-2" />
                  ) : (
                    <HiStatusOnline className="text-green-500 mr-2" />
                  )}
                  <strong className="font-bold"> {device.status}</strong>
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
                    {organization.name || ""}
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
              {!cacheInitialized && (
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-black text-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 mb-6 font-mono text-sm">
              <div>
                <div className="text-gray-400">CHANNEL_ID</div>
                <div className="text-orange-50">"{channel?.id}"</div>
              </div>
              <div>
                <div className="text-gray-400">CHANNEL_NAME</div>
                <div className="text-orange-50">"{channel?.name}"</div>
              </div>
              <div>
                <div className="text-gray-400">CHANNEL_API_KEY</div>
                <div className="text-orange-50">"{apiKey?.apiKey}"</div>
              </div>
              {cacheInitialized && (
                <div>
                  <div className="text-gray-400">CACHE_STATUS</div>
                  <div className="text-green-400">
                    "ACTIVE - INSTANT UPDATES"
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceDetails;
