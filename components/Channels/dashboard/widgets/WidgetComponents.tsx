import React from "react";
import { Image as ImageIcon, Volume2, PlaySquare } from "lucide-react";
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
    title?: string;
    [key: string]: any;
  };
  className?: string;
  color?: string;
  onClick?: () => void;
}

export const SwitchWidget: React.FC<BaseWidgetProps> = ({
  value = true,
  onChange,
  className,
}) => (
  <div className={cn("flex items-center justify-start h-8", className)}>
    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-500">
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
          value ? "translate-x-6" : "translate-x-1",
        )}
      />
    </div>
  </div>
);

export const SliderWidget: React.FC<BaseWidgetProps> = ({
  value = 5,
  onChange,
  settings,
  className,
}) => {
  const min = settings?.min || 0;
  const max = settings?.max || 10;
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div
      className={cn("flex items-center justify-between h-8 px-2", className)}
    >
      <span className="text-teal-500 text-sm">−</span>
      <div className="flex-1 mx-2 relative">
        <div className="h-1 bg-gray-200 rounded-full">
          <div
            className="h-1 bg-teal-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-teal-500 rounded-full"
          style={{
            left: `${percentage}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
      <span className="text-teal-500 text-sm">+</span>
      <span className="text-gray-600 text-sm ml-2">{value}</span>
    </div>
  );
};

export const NumberInputWidget: React.FC<BaseWidgetProps> = ({
  value = 0,
  onChange,
  className,
}) => (
  <div className={cn("flex items-center justify-between h-8 px-2", className)}>
    <button
      onClick={() => onChange?.(Number(value) - 1)}
      className="text-teal-500 text-lg"
    >
      −
    </button>
    <span className="text-2xl font-light text-gray-700">{value}</span>
    <button
      onClick={() => onChange?.(Number(value) + 1)}
      className="text-teal-500 text-lg"
    >
      +
    </button>
  </div>
);

export const LabelWidget: React.FC<BaseWidgetProps> = ({
  value = "167",
  className,
}) => (
  <div className={cn("h-12 p-2", className)}>
    <div className="w-1 h-full bg-blue-600 rounded-full mr-2 float-left" />
    <div className="text-xl font-bold text-gray-800">{value}</div>
  </div>
);

export const GaugeWidget: React.FC<BaseWidgetProps> = ({
  value = 82,
  settings,
  className,
}) => {
  const min = settings?.min || 0;
  const max = settings?.max || 100;

  // Calculate the arc parameters (reversed 180° anticlockwise)
  const centerX = 50;
  const centerY = 50;
  const radius = 40;
  const strokeWidth = 14;

  // Convert degrees to radians (rotated 180° anticlockwise)
  const startAngle = 135 * (Math.PI / 180); // 135° in radians (315° - 180°)
  const endAngle = 45 * (Math.PI / 180); // 45° in radians (225° - 180°)

  // Calculate start and end points for the background arc
  const startX = centerX + radius * Math.cos(startAngle);
  const startY = centerY + radius * Math.sin(startAngle);
  const endX = centerX + radius * Math.cos(endAngle);
  const endY = centerY + radius * Math.sin(endAngle);

  // Create the background arc path (135° to 45°)
  const backgroundPath = `
    M ${startX} ${startY}
    A ${radius} ${radius} 0 1 1 ${endX} ${endY}
  `;

  // Calculate the end point for the progress arc
  const totalAngle = 270; // degrees (135° to 45° = 270°)
  const progressAngle =
    startAngle + (value / 100) * ((totalAngle * Math.PI) / 180);
  const progressEndX = centerX + radius * Math.cos(progressAngle);
  const progressEndY = centerY + radius * Math.sin(progressAngle);

  // Determine if we need a large arc flag for the progress
  const progressAngleSpan = (value / 100) * totalAngle;
  const largeArcFlag = progressAngleSpan > 180 ? 1 : 0;

  // Create the progress arc path
  const progressPath = `
    M ${startX} ${startY}
    A ${radius} ${radius} 0 ${largeArcFlag} 1 ${progressEndX} ${progressEndY}
  `;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-20",
        className,
      )}
    >
      <div className="relative w-16 h-16">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background arc */}
          <path
            d={backgroundPath}
            stroke="rgb(229, 231, 235)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
          {/* Progress arc */}
          <path
            d={progressPath}
            stroke="rgb(34, 197, 94)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-700">{value}</span>
        </div>
      </div>
      <div className="flex justify-center items-center w-full text-xs text-gray-500 mt-1 gap-4">
        <span>0</span>
        <span>100</span>
      </div>
    </div>
  );
};

export const RadialGaugeWidget: React.FC<BaseWidgetProps> = ({
  value = 42,
  settings,
  className,
}) => {
  const min = settings?.min || 0;
  const max = settings?.max || 100;
  const circumference = 2 * Math.PI * 35;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  const strokeWidth = 10;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-24",
        className,
      )}
    >
      <div className="relative w-16 h-16">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r="35"
            stroke="rgb(229, 231, 235)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx="40"
            cy="40"
            r="35"
            stroke="rgb(16, 185, 129)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base font-medium text-gray-700">{value}</span>
        </div>
      </div>
    </div>
  );
};

export const ImageButtonWidget: React.FC<BaseWidgetProps> = ({
  className,
  onChange,
}) => (
  <div className={cn("flex items-center justify-center h-16", className)}>
    <div
      className="w-12 h-12 border-2 border-teal-400 rounded flex items-center justify-center cursor-pointer hover:bg-teal-50"
      onClick={() => onChange?.(true)}
    >
      <ImageIcon className="w-6 h-6 text-teal-400" />
    </div>
  </div>
);

export const VideoWidget: React.FC<BaseWidgetProps> = ({ className }) => (
  <div className={cn("flex items-center justify-center h-16", className)}>
    <PlaySquare className="w-8 h-8 text-gray-600" />
  </div>
);

export const AudioWidget: React.FC<BaseWidgetProps> = ({ className }) => (
  <div className={cn("flex items-center justify-center h-16", className)}>
    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100">
      <Volume2 className="w-5 h-5 text-green-500" />
    </div>
  </div>
);

export const ImageGalleryWidget: React.FC<BaseWidgetProps> = ({
  value = [],
  className,
}) => (
  <div className={cn("flex items-center justify-center h-16", className)}>
    <div className="relative">
      <div className="w-10 h-8 border-2 border-teal-400 rounded flex items-center justify-center">
        <ImageIcon className="w-4 h-4 text-teal-400" />
      </div>
      <div className="absolute -top-1 -right-1 w-8 h-6 border-2 border-teal-400 rounded bg-white flex items-center justify-center">
        <ImageIcon className="w-3 h-3 text-teal-400" />
      </div>
    </div>
  </div>
);

export const CustomChartWidget: React.FC<BaseWidgetProps> = ({
  value = [],
  className,
}) => {
  const data = [
    { x: 0, y: 0 },
    { x: 1, y: 45 },
    { x: 2, y: 25 },
    { x: 3, y: 55 },
    { x: 4, y: 40 },
    { x: 5, y: 100 },
    { x: 6, y: 50 },
  ];

  const pathData = data
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${(point.x / 6) * 100} ${100 - (point.y / 60) * 80}`,
    )
    .join(" ");

  return (
    <div className={cn("h-16 p-2", className)}>
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(34, 197, 94)" />
            <stop offset="50%" stopColor="rgb(59, 130, 246)" />
            <stop offset="100%" stopColor="rgb(168, 85, 247)" />
          </linearGradient>
        </defs>
        <path
          d={pathData}
          stroke="url(#lineGradient)"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    </div>
  );
};

export const HeatmapChartWidget: React.FC<BaseWidgetProps> = ({
  value = [],
  className,
}) => (
  <div className={cn("h-16 p-2", className)}>
    <div className="text-xs font-medium text-gray-700 mb-1">Timeline</div>
    <div className="flex items-center gap-1 mb-1">
      <div className="w-8 h-2 bg-blue-400 rounded-sm" />
      <div className="w-4 h-2 bg-gray-300 rounded-sm" />
      <div className="w-12 h-2 bg-gray-200 rounded-sm" />
    </div>
    <div className="flex justify-between text-xs text-gray-400">
      <span>08:26 AM</span>
      <span>09:00 AM</span>
    </div>
  </div>
);

export const ChartWidget: React.FC<BaseWidgetProps> = ({
  value = [],
  className,
}) => {
  const data = [4, 7, 3, 8, 2, 6, 4];
  const maxValue = Math.max(...data);

  return (
    <div className={cn("h-16 p-3", className)}>
      <div className="flex items-end justify-between h-full">
        {data.map((value, index) => (
          <div
            key={index}
            className="bg-blue-500 rounded-sm"
            style={{
              height: `${(value / maxValue) * 100}%`,
              width: "10px",
            }}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>8:26 AM</span>
        <span>8:43 AM</span>
      </div>
    </div>
  );
};

export const LedWidget: React.FC<BaseWidgetProps> = ({
  value = true,
  className,
}) => (
  <div className={cn("flex items-center justify-center h-8", className)}>
    <div className="w-8 h-8 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
  </div>
);

export const AlarmSoundWidget: React.FC<BaseWidgetProps> = ({
  value = false,
  className,
}) => (
  <div className={cn("flex items-center justify-center h-16", className)}>
    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100">
      <Volume2 className="w-5 h-5 text-green-500" />
    </div>
  </div>
);

export const TerminalWidget: React.FC<BaseWidgetProps> = ({
  value = "",
  className,
}) => (
  <div className={cn("h-18 p-1", className)}>
    <div className="bg-black text-white text-xs p-1 rounded mb-1 font-mono">
      &lt; Power On Power Off Enabled
    </div>
    <div className="bg-black text-white text-xs p-1 rounded font-mono">
      Type here
    </div>
  </div>
);

export const TextInputWidget: React.FC<BaseWidgetProps> = ({
  value = "Zero",
  onChange,
  className,
}) => (
  <div className={cn("flex items-center justify-center h-8 px-2", className)}>
    <input
      type="text"
      placeholder="Zero"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
    />
  </div>
);

export const SegmentedSwitchWidget: React.FC<BaseWidgetProps> = ({
  value = 0,
  onChange,
  settings,
  className,
}) => {
  const options = settings?.options || ["Zero", "One"];

  return (
    <div
      className={cn("flex items-center justify-center h-16 px-2", className)}
    >
      <div className="flex bg-gray-100 rounded overflow-hidden w-full">
        {options.map((option, index) => (
          <div
            key={index}
            className={cn(
              "flex-1 py-1 px-2 text-center text-sm cursor-pointer",
              value === index
                ? "bg-green-500 text-white"
                : "text-gray-700 hover:bg-gray-200",
            )}
            onClick={() => onChange?.(index)}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
};

export const MenuWidget: React.FC<BaseWidgetProps> = ({
  value = "Zero",
  onChange,
  settings,
  className,
}) => {
  const options = settings?.options || ["Zero", "One", "Two"];

  return (
    <div
      className={cn("flex items-center justify-center h-16 px-2", className)}
    >
      <select
        className="w-full px-2 py-1 border border-gray-300 rounded text-sm appearance-none bg-white"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export const ModulesWidget: React.FC<BaseWidgetProps> = ({
  value = {},
  className,
}) => (
  <div className={cn("h-16 p-2 space-y-1", className)}>
    <div className="text-xs text-gray-600">Module</div>
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-700">Switch</span>
      <div className="w-8 h-4 bg-green-500 rounded-full relative">
        <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5" />
      </div>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-700">Label</span>
      <span className="text-xs text-gray-600">String</span>
    </div>
  </div>
);

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
  modules: ModulesWidget,
};

export default function WidgetRegistry({
  type,
  className,
  ...props
}: { type: WidgetType } & BaseWidgetProps) {
  const Component = components[type] || LabelWidget;
  return <Component className={className} {...props} />;
}
