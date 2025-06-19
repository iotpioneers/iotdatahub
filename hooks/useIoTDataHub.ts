import { startIoTDataHubServers } from "@/scripts/start-iotdatahub-servers";
import { useState, useEffect, useRef } from "react";

interface IoTDataHubData {
  [key: string]: any;
}

interface UseIoTDataHubOptions {
  deviceId: string;
  autoReconnect?: boolean;
  reconnectInterval?: number;
}

export function useIoTDataHub({
  deviceId,
  autoReconnect = true,
  reconnectInterval = 5000,
}: UseIoTDataHubOptions) {
  const [data, setData] = useState<IoTDataHubData>({});
  const [connected, setConnected] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState<
    "ONLINE" | "OFFLINE" | "ERROR"
  >("OFFLINE");
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(
      `ws://localhost:${Number(process.env.WS_PORT!) || 8081}`,
    );
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      console.log("Connected to IoTDataHub WebSocket");

      // Subscribe to device updates
      ws.send(
        JSON.stringify({
          type: "subscribe",
          deviceId,
        }),
      );

      // Request current device status
      ws.send(
        JSON.stringify({
          type: "get_device_status",
          deviceId,
        }),
      );
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        handleMessage(message);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      setConnected(false);
      console.log("Disconnected from IoTDataHub WebSocket");

      if (autoReconnect) {
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, reconnectInterval);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnected(false);
    };
  };

  const handleMessage = (message: any) => {
    switch (message.type) {
      case "virtual_pin_update":
        setData((prev) => ({
          ...prev,
          [`V${message.pin}`]: message.value,
        }));
        break;

      case "device_status":
        setDeviceStatus(message.device.status);
        // Update all pin data
        const pinData: IoTDataHubData = {};
        message.device.virtualPins?.forEach((pin: any) => {
          pinData[`V${pin.pinNumber}`] = pin.value;
        });
        setData(pinData);
        break;

      case "device_connected":
        if (message.deviceId === deviceId) {
          setDeviceStatus("ONLINE");
        }
        break;

      case "device_disconnected":
        if (message.deviceId === deviceId) {
          setDeviceStatus("OFFLINE");
        }
        break;
    }
  };

  const virtualWrite = (pin: string, value: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "virtual_write",
          deviceId,
          pin,
          value,
        }),
      );
    }
  };

  const sendCommand = async (command: string, pin: string, value?: any) => {
    try {
      const response = await fetch(`/api/devices/${deviceId}/send-command`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command, pin, value }),
      });

      if (!response.ok) {
        throw new Error("Failed to send command");
      }

      return await response.json();
    } catch (error) {
      console.error("Error sending command:", error);
      throw error;
    }
  };

  useEffect(() => {
    connect();
    startIoTDataHubServers();
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [deviceId]);

  return {
    data,
    connected,
    deviceStatus,
    virtualWrite,
    sendCommand,
    connect,
  };
}
