import React from "react";
import { Image, MapPin, Bell, Play } from "lucide-react";
import { LineChart, Line, XAxis, YAxis } from "recharts";
import {
  Button,
  Card,
  CardContent,
  Input,
  Slider,
  Switch,
} from "@mui/material";
import { WidgetType } from "@/types/widgets";

// Enhanced Widget Props with proper typing
interface BaseWidgetProps {
  color?: string;
  value?: any;
  onChange?: (value: any) => void;
  settings?: {
    max?: number;
    min?: number;
    options?: string[];
    [key: string]: any;
  };
  onClick?: () => void;
  data?: Array<{ name: string; value: number }>;
}

// Control Components
export const SwitchWidget: React.FC<BaseWidgetProps> = ({
  value,
  onChange,
}) => (
  <Card className="w-full">
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <span>Switch</span>
        <Switch
          checked={Boolean(value)}
          onChange={(e) => onChange?.(e.target.checked)}
        />
      </div>
    </CardContent>
  </Card>
);

export const SliderWidget: React.FC<BaseWidgetProps> = ({
  value,
  onChange,
  settings,
}) => (
  <Card className="w-full">
    <CardContent className="pt-6">
      <span>Slider</span>
      <Slider
        value={typeof value === "number" ? value : 0}
        max={settings?.max || 10}
        min={settings?.min || 0}
        step={1}
        onChange={(_, newValue) => onChange?.(newValue)}
      />
      <div className="text-right">{value}</div>
    </CardContent>
  </Card>
);

export const NumberInputWidget: React.FC<BaseWidgetProps> = ({
  value,
  onChange,
}) => (
  <Card className="w-full">
    <CardContent className="pt-6">
      <span>Number Input</span>
      <div className="flex items-center space-x-2">
        <Button
          variant="outlined"
          onClick={() => onChange?.(Number(value) - 1)}
        >
          -
        </Button>
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange?.(Number(e.target.value))}
        />
        <Button
          variant="outlined"
          onClick={() => onChange?.(Number(value) + 1)}
        >
          +
        </Button>
      </div>
    </CardContent>
  </Card>
);

// Display Components
export const LedWidget: React.FC<BaseWidgetProps> = ({ value }) => (
  <Card className="w-full">
    <CardContent className="pt-6">
      <div
        className={`w-4 h-4 rounded-full ${
          Boolean(value) ? "bg-green-500" : "bg-gray-300"
        }`}
      />
    </CardContent>
  </Card>
);

export const LabelWidget: React.FC<BaseWidgetProps> = ({ value }) => (
  <Card className="w-full">
    <CardContent className="pt-6">
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export const GaugeWidget: React.FC<BaseWidgetProps> = ({ value, settings }) => (
  <Card className="w-full">
    <CardContent className="pt-6">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 100 100" className="transform -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="10"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            strokeDasharray={`${
              ((Number(value) || 0) / (settings?.max || 100)) * 283
            } 283`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl">{value}</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Media Components
export const ImageButtonWidget: React.FC<BaseWidgetProps> = ({ onClick }) => (
  <Card className="w-full">
    <CardContent className="pt-6">
      <Button variant="outlined" className="w-full h-24" onClick={onClick}>
        <Image className="w-8 h-8" />
      </Button>
    </CardContent>
  </Card>
);

export const MapWidget: React.FC<BaseWidgetProps> = () => (
  <Card className="w-full">
    <CardContent className="pt-6">
      <div className="relative w-full h-48 bg-gray-100 rounded">
        <MapPin className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
    </CardContent>
  </Card>
);

// Charts
export const ChartWidget: React.FC<BaseWidgetProps> = ({ data }) => (
  <Card className="w-full">
    <CardContent className="pt-6">
      <LineChart width={300} height={200} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
      </LineChart>
    </CardContent>
  </Card>
);

// Interface Components
export const TextInputWidget: React.FC<BaseWidgetProps> = ({
  value,
  onChange,
}) => (
  <Card className="w-full">
    <CardContent className="pt-6">
      <Input
        fullWidth
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </CardContent>
  </Card>
);

export const TerminalWidget: React.FC<BaseWidgetProps> = () => (
  <Card className="w-full">
    <CardContent className="pt-6">
      <div className="bg-black text-white p-4 rounded">
        <div>Power: On Power Off Enabled</div>
        <Input
          fullWidth
          className="bg-transparent border-none text-white"
          placeholder="Type here"
        />
      </div>
    </CardContent>
  </Card>
);

export const SegmentedSwitchWidget: React.FC<BaseWidgetProps> = ({
  value,
  onChange,
  settings,
}) => (
  <Card className="w-full">
    <CardContent className="pt-6">
      <div className="flex rounded-md overflow-hidden border">
        {settings?.options?.map((option: string) => (
          <Button
            key={option}
            variant={value === option ? "contained" : "outlined"}
            className={`flex-1`}
            onClick={() => onChange?.(option)}
          >
            {option}
          </Button>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default function WidgetRegistry({
  type,
  ...props
}: { type: WidgetType } & BaseWidgetProps) {
  const components: Record<WidgetType, React.FC<BaseWidgetProps>> = {
    switch: SwitchWidget,
    slider: SliderWidget,
    numberInput: NumberInputWidget,
    imageButton: ImageButtonWidget,
    webPageImage: ImageButtonWidget,
    led: LedWidget,
    label: LabelWidget,
    gauge: GaugeWidget,
    radialGauge: GaugeWidget,
    alarmSound: () => (
      <Button variant="outlined">
        <Bell />
      </Button>
    ),
    chart: ChartWidget,
    map: MapWidget,
    imageGallery: () => (
      <Button variant="outlined" className="w-full">
        <Image className="w-6 h-6" />
      </Button>
    ),
    customChart: ChartWidget,
    heatmapChart: ChartWidget,
    video: () => (
      <Button variant="outlined" className="w-full">
        <Play className="w-6 h-6" />
      </Button>
    ),
    textInput: TextInputWidget,
    terminal: TerminalWidget,
    segmentedSwitch: SegmentedSwitchWidget,
    menu: () => <div>Menu Widget</div>,
    modules: () => <div>Modules Widget</div>,
  };

  const Component = components[type];
  return Component ? <Component {...props} /> : null;
}
