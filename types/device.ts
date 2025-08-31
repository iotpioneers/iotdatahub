import { ReactNode } from "react";
import { Channel, Organization, User } from "@/types";

export interface DeviceData {
  id: string;
  name: string;
  authToken?: string;
  description?: string;
  deviceType?: "SENSOR" | "ACTUATOR" | "GATEWAY" | "CONTROLLER" | "OTHER";
  status: "ONLINE" | "OFFLINE" | "MAINTENANCE" | "ERROR" | "DISABLED";
  model?: string;
  firmware?: string;
  batteryLevel?: number;
  signal?: number;
  lastPing?: Date;
  metadata?: {
    room?: string;
    [key: string]: any;
  };
  usage?: {
    value: number;
    unit: string;
    period: string;
  };
  user?: User;
  organization: Organization;
  channel: Channel;
  widgets: Widget[];
  alerts: Alert[];
  automations: Automation[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Widget {
  id: string;
  name?: string;
  definition?: {
    type: string;
    data?: any;
  };
  settings?: any;
  color?: string;
}

export interface Alert {
  id: string;
  type: string;
  severity: "INFO" | "WARNING" | "ERROR" | "CRITICAL";
  message: string;
  status: "ACTIVE" | "ACKNOWLEDGED" | "RESOLVED";
}

export interface Automation {
  id: string;
  name: string;
  status: "ACTIVE" | "PAUSED" | "DISABLED";
  type: "SCHEDULED" | "CONDITIONAL" | "TRIGGER" | "SEQUENCE";
}

export interface DeviceTypeConfig {
  icon: ReactNode | string | undefined | any;
  color: string;
  label: string;
}

export interface StatusConfig {
  color: string;
  backgroundColor: string;
  label: string;
  icon: ReactNode | string | undefined | any;
}
