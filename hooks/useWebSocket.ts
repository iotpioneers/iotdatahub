import { useEffect, useRef, useState } from "react";
import { WebSocketMessage } from "@/types/websocket";
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
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const connect = () => {
    if (!enabled) return;

    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//localhost:${config.apiPort}/api/ws`;

      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        setError(null);
        setReconnectAttempts(0);

        // Subscribe to device updates if deviceId is provided
        if (deviceId) {
          wsRef.current?.send(
            JSON.stringify({
              type: "SUBSCRIBE_DEVICE",
              deviceId: deviceId,
            }),
          );
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log("📨 WebSocket message received:", message);

          switch (message.type) {
            case "CONNECTION_ESTABLISHED":
              console.log(
                "✅ WebSocket connection established:",
                message.clientId,
              );
              break;
            case "SUBSCRIPTION_CONFIRMED":
              console.log(
                "✅ Device subscription confirmed:",
                message.deviceId,
              );
              break;
            case "ERROR":
              console.error("❌ WebSocket error:", message.error);
              break;
            default:
              onMessage?.(message);
          }
        } catch (err) {
          console.error("Failed to parse WebSocket message:", err);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log("WebSocket disconnected:", event.code, event.reason);
        setIsConnected(false);

        // Reconnect logic
        if (enabled && reconnectAttempts < 5) {
          const timeout = Math.min(
            1000 * Math.pow(2, reconnectAttempts),
            30000,
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
    };
  }, [enabled, deviceId]);

  const sendMessage = (message: any) => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  return {
    isConnected,
    error,
    sendMessage,
    reconnect: connect,
  };
};
