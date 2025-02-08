// types/device.ts
export interface DeviceData {
  id: string;
  name: string;
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
  widgets: Widget[];
  alerts: Alert[];
  automations: Automation[];
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
