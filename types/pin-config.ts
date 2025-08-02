import { Widget } from "@/types/widgets";

export type PinType = "VIRTUAL" | "GPIO" | "DIGITAL" | "ANALOG";
export type ValueType = "BOOLEAN" | "NUMBER" | "STRING";
export type AutomationType =
  | "POWER_SWITCH"
  | "SWITCH"
  | "RANGE_CONTROL"
  | "SENSOR"
  | "ACTUATOR"
  | "OTHER"
  | "";

export interface PinConfig {
  id?: string;
  widgetId: string;
  deviceId: string;
  pinType: PinType;
  widgetType?: string; // Optional, can be used to specify the widget type
  pinNumber: string;
  valueType: ValueType;
  defaultValue: string | boolean | number;
  minValue?: number;
  maxValue?: number;
  value?: string | number;
  values?: string[] | number[] | boolean[] | null;
  unit?: string;
  options?: string[];
  title: string;
  showLabels?: boolean;
  hideWidgetName?: boolean;
  onValue?: string;
  offValue?: string;
  widgetColor?: string;
  automationType?: AutomationType;
  datastreamName?: string;
  datastreamAlias?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PinConfigModalProps {
  open: boolean;
  onClose: () => void;
  widget: Widget;
  deviceId: string;
  onSave: (config: PinConfig) => void;
  existingConfig?: PinConfig | null;
}

export interface PinConfigFormProps {
  config: Partial<PinConfig>;
  widget: Widget;
  onConfigChange: (config: Partial<PinConfig>) => void;
  onDatastreamCreate: () => void;
}

export interface DatastreamFormProps {
  config: Partial<PinConfig>;
  widget: Widget;
  onConfigChange: (config: Partial<PinConfig>) => void;
  onCancel: () => void;
  onSubmit: (datastreamConfig: Partial<PinConfig>) => void;
}

export interface WidgetPreviewProps {
  widget: Widget;
  config: Partial<PinConfig>;
}

export interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}
