import { WebSocket } from "ws";

export interface WebSocketMessage {
  type:
    | "DEVICE_UPDATE"
    | "HARDWARE_DATA"
    | "DEVICE_STATUS"
    | "CONNECTION_ESTABLISHED"
    | "SUBSCRIPTION_CONFIRMED"
    | "PONG"
    | "ERROR";
  deviceId?: string;
  data?: any;
  clientId?: string;
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
}
