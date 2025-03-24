import React from "react";
import {
  Gauge,
  SlidersHorizontal,
  ToggleLeft,
  ToggleRight,
  Plus,
  Minus,
  Image as ImageIcon,
  Video,
  MapPin,
  Bell,
  Play,
  Terminal,
} from "lucide-react";
import { WidgetType } from "@/types/widgets";
import { cn } from "@/lib/utils";
import DeviceMap from "@/app/(account)/dashboard/devices/_components/DeviceMap";

interface BaseWidgetProps {
  value?: any;
  onChange?: (value: any) => void;
  settings?: {
    max?: number;
    min?: number;
    options?: string[];
    [key: string]: any;
  };
  className?: string;
}

export const SwitchWidget: React.FC<BaseWidgetProps> = ({
  value,
  onChange,
  className,
}) => (
  <div className={cn("flex items-center justify-center h-full", className)}>
    <button
      onClick={() => onChange?.(!value)}
      className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      style={{
        backgroundColor: value ? "#10B981" : "#E5E7EB",
      }}
    >
      <span className="sr-only">Toggle</span>
      <span
        className={`inline-block w-5 h-5 transform transition-transform bg-white rounded-full shadow ${
          value ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);

export const SliderWidget: React.FC<BaseWidgetProps> = ({
  value = 50,
  onChange,
  settings,
  className,
}) => {
  const min = settings?.min || 0;
  const max = settings?.max || 100;

  return (
    <div className={cn("flex flex-col items-center h-full p-2", className)}>
      <div className="w-full flex items-center justify-between mb-1">
        <span className="text-xs text-gray-500">{min}</span>
        <span className="text-sm font-medium">{value}</span>
        <span className="text-xs text-gray-500">{max}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange?.(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
};

export const NumberInputWidget: React.FC<BaseWidgetProps> = ({
  value = 0,
  onChange,
  className,
}) => (
  <div className={cn("flex items-center justify-center h-full", className)}>
    <div className="flex items-center border rounded-lg overflow-hidden divide-x divide-gray-200">
      <button
        onClick={() => onChange?.(Number(value) - 1)}
        className="px-2 py-1 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <Minus className="w-3 h-3" />
      </button>
      <div className="px-3 py-1 text-sm font-medium">{value}</div>
      <button
        onClick={() => onChange?.(Number(value) + 1)}
        className="px-2 py-1 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  </div>
);

export const LabelWidget: React.FC<BaseWidgetProps> = ({
  value = "",
  className,
}) => (
  <div className={cn("flex items-center justify-center h-full", className)}>
    <div className="text-xl font-semibold text-gray-800">{value}</div>
  </div>
);

export const GaugeWidget: React.FC<BaseWidgetProps> = ({
  value = 50,
  settings,
  className,
}) => {
  const min = settings?.min || 0;
  const max = settings?.max || 100;
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("flex flex-col items-center h-full p-2", className)}>
      <div className="relative w-16 h-8">
        <div className="absolute w-full h-2 bg-gray-200 rounded-full top-3"></div>
        <div
          className="absolute h-2 bg-green-500 rounded-full top-3"
          style={{ width: `${percentage}%` }}
        ></div>
        <div className="absolute top-0 left-0 right-0 flex justify-center">
          <div className="text-sm font-medium">{value}</div>
        </div>
      </div>
    </div>
  );
};

export const ImageButtonWidget: React.FC<BaseWidgetProps> = ({
  className,
  onChange,
}) => (
  <div className={cn("flex items-center justify-center h-full", className)}>
    <button
      onClick={() => onChange?.(true)}
      className="p-2 border rounded-lg hover:bg-gray-50 transition-colors"
    >
      <ImageIcon className="w-5 h-5 text-gray-600" />
    </button>
  </div>
);

export const VideoWidget: React.FC<BaseWidgetProps> = ({ className }) => (
  <div className={cn("flex items-center justify-center h-full", className)}>
    <div className="p-2 border rounded-lg">
      <Play className="w-5 h-5 text-gray-600" />
    </div>
  </div>
);

export const ChartWidget: React.FC<BaseWidgetProps> = ({
  value = [],
  className,
}) => {
  const sampleData = [
    { name: "Jan", value: 40 },
    { name: "Feb", value: 30 },
    { name: "Mar", value: 60 },
    { name: "Apr", value: 50 },
  ];

  return (
    <div className={cn("h-full w-full p-1", className)}>
      <div className="relative h-full w-full">
        {sampleData.map((item, index) => (
          <div
            key={index}
            className="absolute bottom-0 bg-blue-500 rounded-t-sm"
            style={{
              left: `${(index / sampleData.length) * 100}%`,
              width: `${90 / sampleData.length}%`,
              height: `${(item.value / 100) * 100}%`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

// Widget Registry
const components: Record<WidgetType, React.FC<BaseWidgetProps>> = {
  switch: SwitchWidget,
  slider: SliderWidget,
  numberInput: NumberInputWidget,
  imageButton: ImageButtonWidget,
  webPageImage: ImageButtonWidget,
  label: LabelWidget,
  gauge: GaugeWidget,
  radialGauge: GaugeWidget,
  chart: ChartWidget,
  video: VideoWidget,
  map: () => <DeviceMap />,
  alarmSound: () => <div>Alarm Widget</div>,
};

export default function WidgetRegistry({
  type,
  className,
  ...props
}: { type: WidgetType } & BaseWidgetProps) {
  const Component = components[type] || LabelWidget;
  return <Component className={className} {...props} />;
}
