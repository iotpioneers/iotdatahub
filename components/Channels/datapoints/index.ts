// ============================================================
// SHARED TYPE DEFINITIONS FOR CHANNEL COMPONENTS
// ============================================================

export type DeviceStatus = "ONLINE" | "OFFLINE" | "DISCONNECTED";
export type Access = "PUBLIC" | "PRIVATE";
export type ActivityType = "active" | "recent";

export interface DataPoint {
  id: string;
  timestamp: string;
  value: number;
  fieldId: string;
  channelId: string;
}

export interface Field {
  id: string;
  name: string;
  description?: string;
  channelId: string;
  dataPoints: DataPoint[];
}

export interface Device {
  id: string;
  name: string;
  description?: string;
  userId: string;
  channelId: string;
  status: DeviceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Channel {
  id: string;
  name: string;
  description?: string;
  access: Access;
  fields: Field[];
  dataPoints: DataPoint[];
  devices: Device[];
  createdAt: string;
  updatedAt: string;
}

export interface ActivityItem {
  id: string;
  deviceId: string;
  deviceName: string;
  fieldName: string;
  value: number;
  unit: string;
  timestamp: string;
  type: ActivityType;
}

export interface WidgetData {
  widgetId: string;
  deviceId: string;
  pinNumber: number;
  widgetName: string;
  values: number[];
  labels: string[];
  unit: string;
}

export interface StatusConfig {
  color: string;
  bg: string;
  label: string;
  dot: string;
}

export interface StatItem {
  label: string;
  value: string | number;
  sub?: string;
}
