import Express from "express";
import { Socket } from "net";
import { TLSSocket } from "tls";

// Base types
export type DeviceSocket = Socket | TLSSocket;

export interface Config {
  iotPort: number;
  iotSSLPort: number;
  logLevel: string;
  apiBaseUrl: string;
  apiPort: number;
}

export interface LogData {
  [key: string]: unknown;
}

export interface Logger {
  log(level: string, message: string, data?: LogData): void;
  info(message: string, data?: LogData): void;
  debug(message: string, data?: LogData): void;
  error(message: string, data?: LogData): void;
}

// Protocol constants
export const PROTOCOL = {
  CMD_RESPONSE: 0,
  CMD_PING: 6,
  CMD_HARDWARE: 20,
  CMD_HARDWARE_SYNC: 16,
  CMD_INTERNAL: 17,
  CMD_HW_LOGIN: 29,
  STATUS_SUCCESS: 200,
} as const;

export type ProtocolCommand = (typeof PROTOCOL)[keyof typeof PROTOCOL];

// Message types
export interface ParsedMessage {
  type: number;
  id: number;
  length: number;
  body: Buffer;
  timestamp: number;
}

export interface MessageConstructorParams {
  type: number;
  id: number;
  length: number;
  body?: Buffer;
}

// Device types
export interface VirtualPinData {
  value: string | number;
  timestamp: number;
}

export interface DeviceWidget {
  [key: string]: {
    value: string | number;
  };
}

export interface DeviceInfo {
  mcu?: string;
  firmware?: string;
  build?: string;
  version?: string;
  heartbeat?: string;
  buffer?: string;
  device?: string;
  template?: string;
  [key: string]: string | undefined;
}

export interface Device {
  token: string;
  socket: DeviceSocket;
  virtualPins: Map<string, VirtualPinData>;
  widgets: DeviceWidget;
  connectTime: number;
}

export interface DeviceStatus {
  connected: boolean;
  token: string;
  virtualPins?: Record<string, VirtualPinData>;
  widgets?: DeviceWidget;
}

// Command parsing types
export type CommandType =
  | "VIRTUAL_WRITE"
  | "VIRTUAL_READ"
  | "DIGITAL_WRITE"
  | "DIGITAL_READ";

export interface ParsedCommand {
  type: CommandType;
  pin: number;
  value?: string | number;
}

// API types
export interface APIRequest {
  deviceToken: string;
  command?: string;
  pin?: number;
  value?: string | number;
  type?: "virtual" | "digital";
}

export interface APIResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  example?: Record<string, unknown>;
}

export interface HardwareCommandData {
  command: string;
  pin: number;
  value?: string | number;
  deviceToken: string;
}

// Data storage types
export interface DeviceUpdateData {
  lastPing: Date;
  status: "ONLINE" | "OFFLINE";
  firmware?: string;
  model?: string;
  ipAddress?: string;
  metadata: DeviceMetadata;
}

export interface DeviceMetadata {
  mcuVersion?: string;
  firmwareType?: string;
  buildInfo?: string;
  iotVersion?: string;
  heartbeat?: number | null | undefined;
  bufferSize?: number | null | undefined;
  template?: string;
  lastInfoUpdate: string;
  connectionCount: number;
  rawDeviceInfo: DeviceInfo;
}

export interface HardwareDataRequest {
  deviceToken: string;
  pinNumber: number;
  value: string | number;
  dataType: "STRING" | "FLOAT";
}

// Connection handler types
export interface ConnectionInfo {
  connectionId: string;
  client: string;
}

export interface DeviceConnectionInfo {
  token: string | null;
  authenticated: boolean;
}

// Device manager interface
export interface IDeviceManager {
  addDevice(token: string, socket: DeviceSocket): void;
  getDevice(token: string): Device | undefined;
  removeDevice(token: string): void;
  getAllDevices(): Device[];
  generateMessageId(): number;
  maskToken(token: string): string;
}

// Protocol handler interface
export interface IProtocolHandler {
  handleMessage(
    socket: DeviceSocket,
    message: ParsedMessage,
    deviceToken: string | null,
  ): Promise<void>;
  sendHardwareCommand(
    deviceToken: string,
    command: string,
    pin: number,
    value?: string | number,
  ): Promise<boolean>;
  sendVirtualWrite(
    deviceToken: string,
    pin: number,
    value: string | number,
  ): Promise<boolean>;
  sendVirtualRead(deviceToken: string, pin: number): Promise<boolean>;
  sendDigitalWrite(
    deviceToken: string,
    pin: number,
    value: number,
  ): Promise<boolean>;
  sendDigitalRead(deviceToken: string, pin: number): Promise<boolean>;
}

// Express request with device
export interface DeviceRequest extends Express.Request {
  device?: Device;
  body: APIRequest;
}

// Message type descriptions
export const MESSAGE_TYPES: Record<number, string> = {
  [PROTOCOL.CMD_RESPONSE]: "RESPONSE",
  [PROTOCOL.CMD_PING]: "PING",
  [PROTOCOL.CMD_HARDWARE]: "HARDWARE_COMMAND",
  [PROTOCOL.CMD_HARDWARE_SYNC]: "HARDWARE_SYNC",
  [PROTOCOL.CMD_INTERNAL]: "DEVICE_INFO",
  [PROTOCOL.CMD_HW_LOGIN]: "LOGIN",
};
// Command name mappings
export const COMMAND_NAMES: Record<string, string> = {
  vw: "VirtualWrite",
  vr: "VirtualRead",
  dw: "DigitalWrite",
  dr: "DigitalRead",
} as const;

// Utility types
export type MaskedToken = string;
export type ConnectionId = string;
export type ClientAddress = string;

// Server creation types
export interface ServerComponents {
  iotServer: import("net").Server;
  iotSSLServer: import("tls").Server | null;
}

export interface SSLOptions {
  key: Buffer;
  cert: Buffer;
  rejectUnauthorized: boolean;
}
