"use client";

import { cn } from "@/lib/utils";
import { ChartBarIcon } from "@heroicons/react/20/solid";
import {
  NumberCircleOne,
  Gauge,
  ImageSquare,
  MapPin,
  Terminal,
  SlidersHorizontal,
  SpeakerHigh,
  TextT,
  ChartLine,
  ChartBar,
} from "@phosphor-icons/react";
import { SwitchIcon } from "@radix-ui/react-icons";
import {
  GaugeIcon,
  ImageIcon,
  PlaySquare,
  Menu as MenuIcon,
  Volume2,
} from "lucide-react";
import { Widget, WidgetDefinition } from "@/types/widgets";
import { useDraggable } from "@dnd-kit/core";
import { WidgetsOutlined } from "@mui/icons-material";
import DeviceMap from "@/app/(account)/dashboard/devices/_components/DeviceMap";

// Utility function to adjust the default size
const adjustWidgetSize = (
  size: { w: number; h: number },
  reduction: number,
) => ({
  w: size.w - reduction,
  h: size.h - reduction,
});

// Enhanced Widget Preview Components (same as original)
const WidgetPreviewComponents = {
  switch: () => {
    return (
      <div className="flex items-center justify-start h-8">
        <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-500">
          <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
        </div>
      </div>
    );
  },

  slider: () => {
    return (
      <div className="flex items-center justify-between h-8 px-2">
        <span className="text-teal-500 text-sm">−</span>
        <div className="flex-1 mx-2 relative">
          <div className="h-1 bg-gray-200 rounded-full">
            <div
              className="h-1 bg-teal-500 rounded-full"
              style={{ width: `50%` }}
            />
          </div>
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-teal-500 rounded-full"
            style={{
              left: `50%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
        <span className="text-teal-500 text-sm">+</span>
        <span className="text-gray-600 text-sm ml-2">5</span>
      </div>
    );
  },

  numberInput: () => {
    return (
      <div className="flex items-center justify-between h-8 px-2">
        <button className="text-teal-500 text-lg">−</button>
        <span className="text-2xl font-light text-gray-700">0</span>
        <button className="text-teal-500 text-lg">+</button>
      </div>
    );
  },

  imageButton: () => (
    <div className="flex items-center justify-center h-16">
      <div className="w-12 h-12 border-2 border-teal-400 rounded flex items-center justify-center">
        <ImageIcon className="w-6 h-6 text-teal-400" />
      </div>
    </div>
  ),

  led: () => {
    return (
      <div className="flex items-center justify-center h-8">
        <div className="w-8 h-8 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
      </div>
    );
  },

  label: () => {
    return (
      <div className="h-12 p-2">
        <div className="w-1 h-full bg-blue-600 rounded-full mr-2 float-left" />
        <div className="text-xl font-bold text-gray-800">167</div>
      </div>
    );
  },

  gauge: () => {
    const value = 82;
    const centerX = 50;
    const centerY = 50;
    const radius = 40;
    const strokeWidth = 14;
    const startAngle = 135 * (Math.PI / 180);
    const endAngle = 45 * (Math.PI / 180);
    const startX = centerX + radius * Math.cos(startAngle);
    const startY = centerY + radius * Math.sin(startAngle);
    const endX = centerX + radius * Math.cos(endAngle);
    const endY = centerY + radius * Math.sin(endAngle);
    const backgroundPath = `M ${startX} ${startY} A ${radius} ${radius} 0 1 1 ${endX} ${endY}`;
    const totalAngle = 270;
    const progressAngle =
      startAngle + (value / 100) * ((totalAngle * Math.PI) / 180);
    const progressEndX = centerX + radius * Math.cos(progressAngle);
    const progressEndY = centerY + radius * Math.sin(progressAngle);
    const progressAngleSpan = (value / 100) * totalAngle;
    const largeArcFlag = progressAngleSpan > 180 ? 1 : 0;
    const progressPath = `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${progressEndX} ${progressEndY}`;

    return (
      <div className="flex flex-col items-center justify-center h-20">
        <div className="relative w-16 h-16">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <path
              d={backgroundPath}
              stroke="rgb(229, 231, 235)"
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
            />
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
  },

  radialGauge: () => {
    const value = 42;
    const circumference = 2 * Math.PI * 35;
    const strokeDashoffset = circumference - (value / 100) * circumference;
    const strokeWidth = 10;

    return (
      <div className="flex flex-col items-center justify-center h-24">
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
  },

  alarmSound: () => {
    return (
      <div className="flex items-center justify-center h-16">
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100">
          <Volume2 className="w-5 h-5 text-green-500" />
        </div>
      </div>
    );
  },

  chart: () => {
    const data = [4, 7, 3, 8, 2, 6, 4];
    const maxValue = Math.max(...data);

    return (
      <div className="h-16 p-3">
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
  },

  customChart: () => {
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
      <div className="h-16 p-2">
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
  },

  heatmapChart: () => (
    <div className="h-16 p-2">
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
  ),

  textInput: () => (
    <div className="flex items-center justify-center h-8 px-2">
      <input
        type="text"
        placeholder="Zero"
        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
        readOnly
      />
    </div>
  ),

  terminal: () => {
    return (
      <div className="h-18 p-1">
        <div className="bg-black text-white text-xs p-1 rounded mb-1 font-mono">
          &lt; Power On Power Off Enabled
        </div>
        <div className="bg-black text-white text-xs p-1 rounded font-mono">
          Type here
        </div>
      </div>
    );
  },

  segmentedSwitch: () => {
    return (
      <div className="flex items-center justify-center h-16 px-2">
        <div className="flex bg-gray-100 rounded overflow-hidden w-full">
          <div className="flex-1 py-1 px-2 text-center text-sm bg-green-500 text-white">
            Zero
          </div>
          <div className="flex-1 py-1 px-2 text-center text-sm text-gray-700">
            One
          </div>
        </div>
      </div>
    );
  },

  menu: () => (
    <div className="flex items-center justify-center h-16 px-2">
      <select className="w-full px-2 py-1 border border-gray-300 rounded text-sm appearance-none bg-white">
        <option>Zero</option>
        <option>One</option>
        <option>Two</option>
      </select>
    </div>
  ),

  modules: () => (
    <div className="h-16 p-2 space-y-1">
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
  ),

  map: () => (
    <div className="flex flex-col items-center justify-center h-24">
      <DeviceMap />
    </div>
  ),

  imageGallery: () => (
    <div className="flex items-center justify-center h-16">
      <div className="relative">
        <div className="w-10 h-8 border-2 border-teal-400 rounded flex items-center justify-center">
          <ImageIcon className="w-4 h-4 text-teal-400" />
        </div>
        <div className="absolute -top-1 -right-1 w-8 h-6 border-2 border-teal-400 rounded bg-white flex items-center justify-center">
          <ImageIcon className="w-3 h-3 text-teal-400" />
        </div>
      </div>
    </div>
  ),

  video: () => (
    <div className="flex items-center justify-center h-16">
      <PlaySquare className="w-8 h-8 text-gray-600" />
    </div>
  ),
};

// Enhanced Widget Preview Component
const WidgetPreview = ({ widget }: { widget: Widget }) => {
  const PreviewComponent =
    WidgetPreviewComponents[
      widget.definition?.type as keyof typeof WidgetPreviewComponents
    ];

  if (!PreviewComponent) {
    return (
      <div className="flex items-center justify-center h-16 text-gray-400">
        {widget.definition?.icon || (
          <div className="w-6 h-6 bg-gray-200 rounded" />
        )}
      </div>
    );
  }

  return <PreviewComponent />;
};

// Comprehensive widget definitions
const widgetDefinitions: Record<string, WidgetDefinition[]> = {
  control: [
    {
      type: "switch",
      label: "Switch",
      icon: <SwitchIcon className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "control",
    },
    {
      type: "slider",
      label: "Slider",
      icon: <SlidersHorizontal className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "control",
    },
    {
      type: "numberInput",
      label: "Number Input",
      icon: <NumberCircleOne className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "control",
    },
    {
      type: "imageButton",
      label: "Image Button",
      icon: <ImageIcon className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "control",
    },
  ],
  display: [
    {
      type: "led",
      label: "LED",
      icon: <Gauge className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "display",
    },
    {
      type: "label",
      label: "Label",
      icon: <TextT className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "display",
    },
    {
      type: "gauge",
      label: "Gauge",
      icon: <GaugeIcon className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "display",
    },
    {
      type: "radialGauge",
      label: "Radial Gauge",
      icon: <Gauge className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "display",
    },
    {
      type: "alarmSound",
      label: "Alarm and Sound",
      icon: <SpeakerHigh className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "display",
    },
  ],
  chart: [
    {
      type: "chart",
      label: "Chart",
      icon: <ChartBarIcon className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "chart",
    },
    {
      type: "customChart",
      label: "Custom Chart",
      icon: <ChartLine className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "chart",
    },
    {
      type: "heatmapChart",
      label: "Heatmap Chart",
      icon: <ChartBar className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "chart",
    },
  ],
  media: [
    {
      type: "map",
      label: "Map",
      icon: <MapPin className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "media",
    },
    {
      type: "imageGallery",
      label: "Image Gallery",
      icon: <ImageSquare className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "media",
    },
    {
      type: "video",
      label: "Video",
      icon: <PlaySquare className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "media",
    },
  ],
  input: [
    {
      type: "textInput",
      label: "Text Input",
      icon: <TextT className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "input",
    },
    {
      type: "terminal",
      label: "Terminal",
      icon: <Terminal className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "input",
    },
    {
      type: "segmentedSwitch",
      label: "Segmented Switch",
      icon: <SwitchIcon className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "input",
    },
    {
      type: "menu",
      label: "Menu",
      icon: <MenuIcon className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "input",
    },
  ],
  misc: [
    {
      type: "modules",
      label: "Modules",
      icon: <WidgetsOutlined className="w-3 h-3" />,
      defaultSize: adjustWidgetSize({ w: 25, h: 25 }, 5),
      category: "misc",
    },
  ],
};

const DraggableWidgetBox = ({ widget }: { widget: Widget }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: widget.id as string,
      data: { widget },
    });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition: isDragging ? "none" : "transform 0.2s ease",
    zIndex: isDragging ? 999 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "rounded-lg bg-white p-2 border border-gray-200 shadow-md hover:shadow-lg transition-all",
        "bg-gradient-to-b from-white to-gray-100",
        isDragging ? "cursor-grabbing shadow-lg" : "cursor-grab",
      )}
      role="button"
      tabIndex={0}
    >
      <div className="font-bold text-base mb-1">
        {widget?.definition?.label || `Widget`}
      </div>
      <WidgetPreview widget={widget} />
    </div>
  );
};

interface WidgetBoxProps {
  deviceId: string;
  onWidgetAdded?: (widgetId: string) => void;
}

const WidgetBox = ({ deviceId, onWidgetAdded }: WidgetBoxProps) => {
  const createWidget = (definition: WidgetDefinition): Widget => ({
    id: `${definition.type}-${Date.now()}`,
    definition,
    settings: {},
    deviceId,
  });

  const handleDoubleClick = (definition: WidgetDefinition) => {
    // For double-click, we'll create a temporary widget and trigger the onDrop handler
    const widget = createWidget(definition);

    // Dispatch a custom event that the DragDropProvider can listen to
    window.dispatchEvent(
      new CustomEvent("widget-double-click", {
        detail: { widget },
      }),
    );

    if (onWidgetAdded) {
      onWidgetAdded(widget.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="p-3 flex items-center gap-2 border-b border-gray-200">
        <WidgetsOutlined className="text-gray-700 text-xl" />
        <h2 className="text-xl font-bold text-gray-800">Widget Box</h2>
      </div>
      <div className="p-3 max-h-[calc(80vh)] overflow-y-auto">
        {Object.entries(widgetDefinitions).map(([category, definitions]) => (
          <div key={category} className="mb-4 last:mb-0">
            <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">
              {category}
            </h3>
            <div className="grid grid-cols-1 gap-2 mb-5">
              {definitions.map((definition: WidgetDefinition) => {
                const widget = createWidget(definition);
                return (
                  <div
                    key={definition.type}
                    onDoubleClick={() => handleDoubleClick(definition)}
                    className="cursor-pointer rounded transition-colors hover:bg-gray-50"
                  >
                    <DraggableWidgetBox widget={widget} key={widget.id} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WidgetBox;
