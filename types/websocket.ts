import { WebSocket } from "ws";

export interface WebSocketMessage {
  type:
    | "DEVICE_UPDATE"
    | "HARDWARE_DATA"
    | "DEVICE_STATUS"
    | "CONNECTION_ESTABLISHED"
    | "SUBSCRIPTION_CONFIRMED"
    | "WIDGET_UPDATE"
    | "CACHE_INITIALIZED"
    | "PONG"
    | "ERROR";
  deviceId?: string;
  data?: any;
  clientId?: string;
  stats?: any;
  cacheReady?: boolean;
  cacheStats?: any;
  error?: string;
  timestamp?: string;
}

export interface WebSocketClient {
  ws: WebSocket;
  deviceId?: string;
  userId?: string;
  subscriptions: Set<string>;
}

export interface DeviceUpdate {
  deviceId: string;
  pin: number;
  value: string | number;
  timestamp: string;
  command: string;
  widget?: {
    id: string;
    value: string | number;
    pinConfig: any;
  };
}
