export interface Widget {
  id: string;
  type: WidgetType;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  settings: any;
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
  | "segmentedSwitch"
  | "menu"
  | "modules";

export interface WidgetDefinition {
  type: WidgetType;
  label: string;
  icon: string;
  defaultSize: { w: number; h: number };
  maxSize?: { w: number; h: number };
  category: "control" | "display" | "input" | "chart" | "media" | "misc";
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
