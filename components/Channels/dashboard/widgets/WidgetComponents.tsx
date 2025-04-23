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
  Circle,
  Sun,
  Lightbulb,
  AlertTriangle,
  Type,
  Grid,
  Menu,
  Volume,
} from "lucide-react";
import { WidgetType } from "@/types/widgets";
import { cn } from "@/lib/utils";
import DeviceMap from "@/app/(account)/dashboard/devices/_components/DeviceMap";
import Image from "next/image";

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
  color?: string;
  onClick?: () => void;
}

export const SwitchWidget: React.FC<BaseWidgetProps> = ({
  value,
  onChange,
  className,
  color = "#10B981",
}) => (
  <div className={cn("flex items-center justify-center h-full", className)}>
    <button
      onClick={() => onChange?.(!value)}
      className="relative inline-flex items-center h-6 rounded-full w-11 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
      style={{
        backgroundColor: value ? color : "#E5E7EB",
      }}
    >
      <span className="sr-only">Toggle</span>
      <span
        className={`inline-block w-5 h-5 transform transition-all duration-300 bg-white rounded-full shadow ${
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
  color = "#10B981",
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
        style={{
          accentColor: color,
        }}
      />
    </div>
  );
};

export const NumberInputWidget: React.FC<BaseWidgetProps> = ({
  value = 0,
  onChange,
  className,
  color = "#10B981",
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
  color = "#000000",
}) => (
  <div className={cn("flex items-center justify-center h-full", className)}>
    <div className="text-xl font-semibold" style={{ color }}>
      {value}
    </div>
  </div>
);

export const GaugeWidget: React.FC<BaseWidgetProps> = ({
  value = 50,
  settings,
  className,
  color = "#10B981",
}) => {
  const min = settings?.min || 0;
  const max = settings?.max || 100;
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("flex flex-col items-center h-full p-2", className)}>
      <div className="relative w-16 h-8">
        <div className="absolute w-full h-2 bg-gray-200 rounded-full top-3"></div>
        <div
          className="absolute h-2 rounded-full top-3 transition-all duration-500"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        ></div>
        <div className="absolute top-0 left-0 right-0 flex justify-center">
          <div className="text-sm font-medium">{value}</div>
        </div>
      </div>
    </div>
  );
};

export const RadialGaugeWidget: React.FC<BaseWidgetProps> = ({
  value = 50,
  settings,
  className,
  color = "#10B981",
}) => {
  const min = settings?.min || 0;
  const max = settings?.max || 100;
  const percentage = ((value - min) / (max - min)) * 100;
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-full p-2",
        className,
      )}
    >
      <svg className="w-16 h-16 transform -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="transparent"
          stroke="#E5E7EB"
          strokeWidth="4"
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="text-sm font-medium mt-2">{value}</div>
    </div>
  );
};

export const ImageButtonWidget: React.FC<BaseWidgetProps> = ({
  className,
  onChange,
  color = "#10B981",
}) => (
  <div className={cn("flex items-center justify-center h-full", className)}>
    <button
      onClick={() => onChange?.(true)}
      className="p-2 border rounded-lg hover:bg-gray-50 transition-colors"
      style={{ borderColor: color }}
    >
      <ImageIcon className="w-5 h-5" style={{ color }} />
    </button>
  </div>
);

export const VideoWidget: React.FC<BaseWidgetProps> = ({
  className,
  color = "#10B981",
}) => (
  <div className={cn("flex items-center justify-center h-full", className)}>
    <div className="p-2 border rounded-lg" style={{ borderColor: color }}>
      <Play className="w-5 h-5" style={{ color }} />
    </div>
  </div>
);

export const AudioWidget: React.FC<BaseWidgetProps> = ({
  className,
  color = "#10B981",
}) => (
  <div className={cn("flex items-center justify-center h-full", className)}>
    <div className="p-2 border rounded-lg" style={{ borderColor: color }}>
      <Volume className="w-5 h-5" style={{ color }} />
    </div>
  </div>
);

//  Add three missing widgets defined in components/Channels  imageGallery: ImageGalleryWidget,
//  customChart: CustomChartWidget,  heatmapChart: HeatmapChartWidget,

export const ImageGalleryWidget: React.FC<BaseWidgetProps> = ({
  value = [],
  className,
  color = "#10B981",
}) => {
  return (
    <div
      className={cn("flex flex-col h-full p-2 bg-gray-900 rounded", className)}
    >
      <div className="flex items-center mb-1">
        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
      </div>
      <div className="flex-1 overflow-auto">
        {value.map((image: string, index: number) => (
          <Image
            key={index}
            src={image}
            alt={`Image ${index}`}
            className="w-full h-auto mb-2"
            width={200}
          />
        ))}
      </div>
    </div>
  );
};

export const CustomChartWidget: React.FC<BaseWidgetProps> = ({
  value = [],
  className,
  color = "#10B981",
}) => {
  return <div className={cn("h-full w-full p-1", className)}>{value}</div>;
};

export const HeatmapChartWidget: React.FC<BaseWidgetProps> = ({
  value = [],
  className,
  color = "#10B981",
}) => {
  return <div className={cn("h-full w-full p-1", className)}>{value}</div>;
};

export const ChartWidget: React.FC<BaseWidgetProps> = ({
  value = [],
  className,
  color = "#10B981",
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
            className="absolute bottom-0 rounded-t-sm transition-all duration-500"
            style={{
              left: `${(index / sampleData.length) * 100}%`,
              width: `${90 / sampleData.length}%`,
              height: `${(item.value / 100) * 100}%`,
              backgroundColor: color,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export const LedWidget: React.FC<BaseWidgetProps> = ({
  value = false,
  className,
  color = "#10B981",
}) => (
  <div className={cn("flex items-center justify-center h-full", className)}>
    <div
      className="w-8 h-8 rounded-full shadow-lg transition-all duration-300"
      style={{
        backgroundColor: value ? color : `${color}30`,
        boxShadow: value ? `0 0 10px ${color}` : "none",
      }}
    />
  </div>
);

export const AlarmSoundWidget: React.FC<BaseWidgetProps> = ({
  value = false,
  className,
  color = "#EF4444",
}) => (
  <div className={cn("flex items-center justify-center h-full", className)}>
    <div className="relative">
      <Bell
        className="w-8 h-8 transition-all duration-300"
        style={{
          color: value ? color : "#9CA3AF",
          transform: value ? "scale(1.1)" : "scale(1)",
        }}
      />
      {value && (
        <div
          className="absolute inset-0 rounded-full animate-ping opacity-75"
          style={{ backgroundColor: color }}
        />
      )}
    </div>
  </div>
);

export const TerminalWidget: React.FC<BaseWidgetProps> = ({
  value = "",
  className,
  color = "#10B981",
}) => (
  <div
    className={cn("flex flex-col h-full p-2 bg-gray-900 rounded", className)}
  >
    <div className="flex items-center mb-1">
      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
      <div className="w-3 h-3 rounded-full bg-green-500"></div>
    </div>
    <div className="flex-1 overflow-auto font-mono text-sm text-green-400 p-1">
      {value || "> Ready for commands..."}
    </div>
  </div>
);

export const TextInputWidget: React.FC<BaseWidgetProps> = ({
  value = "",
  onChange,
  className,
  color = "#10B981",
}) => (
  <div className={cn("flex items-center justify-center h-full", className)}>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1"
      style={{
        borderColor: color,
      }}
    />
  </div>
);

export const SegmentedSwitchWidget: React.FC<BaseWidgetProps> = ({
  value = 0,
  onChange,
  settings,
  className,
  color = "#10B981",
}) => {
  const options = settings?.options || ["Option 1", "Option 2", "Option 3"];

  return (
    <div className={cn("flex items-center justify-center h-full", className)}>
      <div className="flex border rounded-lg overflow-hidden divide-x">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onChange?.(index)}
            className={`px-3 py-1 text-sm transition-colors ${
              value === index ? "font-medium" : "text-gray-500"
            }`}
            style={{
              backgroundColor: value === index ? `${color}20` : "transparent",
              color: value === index ? color : "inherit",
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export const MenuWidget: React.FC<BaseWidgetProps> = ({
  value = "",
  onChange,
  settings,
  className,
  color = "#10B981",
}) => {
  const options = settings?.options || ["Menu 1", "Menu 2", "Menu 3"];

  return (
    <div className={cn("flex flex-col h-full p-2", className)}>
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onChange?.(option)}
          className={`px-3 py-2 my-1 rounded text-left transition-colors ${
            value === option ? "font-medium" : "text-gray-500"
          }`}
          style={{
            backgroundColor: value === option ? `${color}20` : "transparent",
            color: value === option ? color : "inherit",
          }}
        >
          {option}
        </button>
      ))}
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
  radialGauge: RadialGaugeWidget,
  chart: ChartWidget,
  video: VideoWidget,
  imageGallery: ImageGalleryWidget,
  customChart: CustomChartWidget,
  heatmapChart: HeatmapChartWidget,
  map: () => <DeviceMap />,
  alarmSound: AlarmSoundWidget,
  led: LedWidget,
  textInput: TextInputWidget,
  terminal: TerminalWidget,
  toggle: SwitchWidget,
  segmentedSwitch: SegmentedSwitchWidget,
  menu: MenuWidget,
  modules: MenuWidget,
};

export default function WidgetRegistry({
  type,
  className,
  ...props
}: { type: WidgetType } & BaseWidgetProps) {
  const Component = components[type] || LabelWidget;
  return <Component className={className} {...props} />;
}
