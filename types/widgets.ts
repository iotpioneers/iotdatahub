import { PinConfig } from "./pin-config";

export interface Widget {
  id: string;
  name?: string | null;
  dataSource?: {
    fieldId?: string;
    refreshInterval?: number;
  };
  definition?: WidgetDefinition | null;
  position?: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  } | null;
  settings?: WidgetSettings | null;
  pinConfig?: PinConfig | null;
  deviceId?: string | null;
  channelId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type WidgetType =
  | "switch"
  | "slider"
  | "numberInput"
  | "imageButton"
  | "webPageImage"
  | "led"
  | "label"
  | "gauge"
  | "radialGauge"
  | "alarmSound"
  | "chart"
  | "map"
  | "imageGallery"
  | "customChart"
  | "heatmapChart"
  | "video"
  | "textInput"
  | "terminal"
  | "toggle"
  | "segmentedSwitch"
  | "menu"
  | "modules";

export interface WidgetDefinition {
  type?: WidgetType;
  label?: string;
  icon?: JSX.Element;
  defaultSize?: { w?: number; h?: number };
  maxSize?: { w?: number; h?: number };
  category?: "control" | "display" | "input" | "chart" | "media" | "misc";
}

export interface WidgetSettings {
  title?: string;
  color?: string;
  backgroundColor?: string;
  min?: number;
  max?: number;
  value?: number;
  labels?: string[];
  data?: any;
  [key: string]: any;
}

export type WidgetCategory =
  | "control"
  | "display"
  | "input"
  | "chart"
  | "media"
  | "misc"
  | "interface";
