import { useEffect, useRef, useState } from "react";
import { WebSocketMessage } from "@/types/websocket";
import { useSession } from "next-auth/react";
import config from "@/lib/hardwareServer/config";

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
      console.warn("WebSocket not connected, cannot send message:", message);
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

  const connect = () => {
    if (!enabled) return;

    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//localhost:${config.apiPort}/api/ws`;

      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log("WebSocket connected - Enhanced with cache support");
        setIsConnected(true);
        setError(null);
        setReconnectAttempts(0);

        // Process any queued messages
        processMessageQueue();

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
          console.log("WebSocket message received:", message);

          switch (message.type) {
            case "CONNECTION_ESTABLISHED":
              console.log(
                "WebSocket connection established:",
                message.clientId,
              );
              setCacheReady(message.cacheReady || false);
              break;

            case "SUBSCRIPTION_CONFIRMED":
              console.log("Device subscription confirmed:", message.deviceId);
              break;

            case "CACHE_INITIALIZED":
              console.log("Cache initialized:", message.stats);
              setCacheReady(true);
              break;

            case "ERROR":
              console.error("WebSocket error:", message.error);
              setError(message.error ?? null);
              break;

            case "PONG":
              console.log(
                "Pong received with cache stats:",
                message.cacheStats,
              );
              break;

            default:
              // Forward all other messages to the handler
              onMessage?.(message);
          }
        } catch (err) {
          console.error("Failed to parse WebSocket message:", err);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log("WebSocket disconnected:", event.code, event.reason);
        setIsConnected(false);
        setCacheReady(false);

        // Clear message queue on disconnect
        messageQueueRef.current = [];

        // Reconnect logic with exponential backoff
        if (enabled && reconnectAttempts < 5) {
          const timeout = Math.min(
            1000 * Math.pow(2, reconnectAttempts),
            30000,
          );
          console.log(
            `Reconnecting in ${timeout}ms (attempt ${reconnectAttempts + 1}/5)`,
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts((prev) => prev + 1);
            connect();
          }, timeout);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setError("WebSocket connection error");
      };
    } catch (err) {
      console.error("Failed to create WebSocket connection:", err);
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

  console.log("====================================");
  console.log(
    "WebSocket connection state:",
    isConnected ? "Connected" : "Disconnected",
    "cacheReady",
    cacheReady,
    "error",
    error,
    "reconnectAttempts",
    reconnectAttempts,
    "deviceId",
    deviceId,
    "ping",
    ping,
    "sendMessage",
    sendMessage,
    "initializeCache",
    initializeCache,
    "refreshDevice",
    refreshDevice,
    "reconnect",
    connect,
    "stats",
    {
      reconnectAttempts,
      maxReconnectAttempts: 5,
    },
  );
  console.log("====================================");

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
      maxReconnectAttempts: 5,
    },
  };
};
