"use client";

import { useEffect, useRef, useState } from "react";
import type { WebSocketMessage } from "@/types/websocket";
import { useSession } from "next-auth/react";

interface UseWebSocketProps {
  deviceId?: string;
  onMessage?: (message: WebSocketMessage) => void;
  enabled?: boolean;
}

export const useWebSocket = ({
  deviceId,
  onMessage,
  enabled = true,
}: UseWebSocketProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cacheReady, setCacheReady] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const { data: session } = useSession();
  const messageQueueRef = useRef<any[]>([]); // Queue for messages to send when connected

  const sendMessage = (message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else if (
      wsRef.current &&
      wsRef.current.readyState === WebSocket.CONNECTING
    ) {
      // Add to queue if still connecting
      messageQueueRef.current.push(message);
    } else {
      setError("WebSocket not connected, cannot send message");
    }
  };

  const processMessageQueue = () => {
    while (messageQueueRef.current.length > 0) {
      const message = messageQueueRef.current.shift();
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(message));
      }
    }
  };

  const getWebSocketUrl = () => {
    // Use environment variable for backend URL
    const backendUrl =
      process.env.HARDWARE_APP_BASE_URL || "http://localhost:5000";

    // Convert HTTP URL to WebSocket URL
    const wsUrl = backendUrl
      .replace("http://", "ws://")
      .replace("https://", "wss://");

    return `${wsUrl}/api/ws`;
  };

  const connect = () => {
    if (!enabled) return;

    try {
      const wsUrl = getWebSocketUrl();
      console.log("Connecting to WebSocket:", wsUrl);

      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        setError(null);
        setReconnectAttempts(0);

        // Process any queued messages
        processMessageQueue();

        if (session?.user?.id && session?.user?.organizationId) {
          sendMessage({
            type: "INITIALIZE_CACHE",
            userId: session.user.id,
            organizationId: session.user.organizationId,
          });
        }

        // Subscribe to device updates if deviceId is provided
        if (deviceId) {
          sendMessage({
            type: "SUBSCRIBE_DEVICE",
            deviceId: deviceId,
            userId: session?.user?.id,
            organizationId: session?.user?.organizationId,
          });
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);

          switch (message.type) {
            case "CONNECTION_ESTABLISHED":
              setCacheReady(message.cacheReady || false);
              break;

            case "SUBSCRIPTION_CONFIRMED":
              setError("Device subscription confirmed");
              break;

            case "CACHE_INITIALIZED":
              setError("Cache initialized");
              setCacheReady(true);
              break;

            case "ERROR":
              setError(message.error ?? null);
              break;

            case "PONG":
              break;

            default:
              // Forward all other messages to the handler
              onMessage?.(message);
          }
        } catch (err) {
          setError("Failed to parse WebSocket message");
        }
      };

      wsRef.current.onclose = (event) => {
        setIsConnected(false);
        setCacheReady(false);

        // Clear message queue on disconnect
        messageQueueRef.current = [];

        if (enabled && reconnectAttempts < 3) {
          const timeout =
            reconnectAttempts === 0
              ? 1000
              : Math.min(1000 * Math.pow(2, reconnectAttempts), 10000);
          setError(
            `Reconnecting in ${timeout}ms (attempt ${reconnectAttempts + 1}/3)`,
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts((prev) => prev + 1);
            connect();
          }, timeout);
        }
      };

      wsRef.current.onerror = (error) => {
        setError(`WebSocket connection error: ${wsUrl}`);
      };
    } catch (err) {
      setError("Failed to create WebSocket connection");
    }
  };

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
      // Clear message queue on unmount
      messageQueueRef.current = [];
    };
  }, [enabled, deviceId, session?.user?.id, session?.user?.organizationId]);

  // Enhanced ping with cache status request
  const ping = () => {
    sendMessage({
      type: "PING",
      timestamp: new Date().toISOString(),
    });
  };

  // Initialize cache manually
  const initializeCache = () => {
    if (session?.user?.id && session?.user?.organizationId) {
      sendMessage({
        type: "INITIALIZE_CACHE",
        userId: session.user.id,
        organizationId: session.user.organizationId,
      });
    }
  };

  // Request device refresh
  const refreshDevice = (targetDeviceId?: string) => {
    sendMessage({
      type: "REFRESH_DEVICE",
      deviceId: targetDeviceId || deviceId,
    });
  };

  return {
    isConnected,
    cacheReady,
    error,
    sendMessage,
    ping,
    initializeCache,
    refreshDevice,
    reconnect: connect,
    stats: {
      reconnectAttempts,
      maxReconnectAttempts: 3, // Reduced max attempts
    },
  };
};