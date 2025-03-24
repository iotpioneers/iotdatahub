"use client";

import { ChartBarIcon } from "@heroicons/react/20/solid";
import {
  NumberCircleOne,
  Gauge,
  ImageSquare,
  MapPin,
  Terminal,
  SlidersHorizontal,
  Video,
  SpeakerHigh,
  TextT,
  ChartLine,
  ChartBar,
} from "@phosphor-icons/react";
import { SliderIcon, SwitchIcon } from "@radix-ui/react-icons";
import {
  GaugeIcon,
  ImageIcon,
  PlaySquare,
  Menu as MenuIcon,
} from "lucide-react";
import { Widget, WidgetDefinition, WidgetType } from "@/types/widgets";
import { useDraggable } from "@dnd-kit/core";
import useAdd from "@/hooks/useAdd";
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

const generateDefaultPosition = (): {
  x: number;
  y: number;
  width: number;
  height: number;
} => ({
  x: 0,
  y: 0,
  width: 2,
  height: 2,
});

// Comprehensive widget definitions based on the images
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
    {
      type: "webPageImage",
      label: "Web Page Image Button",
      icon: <ImageSquare className="w-3 h-3" />,
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

// Mock widgets with visual representation components
const WidgetPreviews: Record<WidgetType, React.FC> = {
  switch: () => (
    <div className="flex items-center space-x-2">
      <div className="w-6 h-3 rounded-full bg-green-500 relative">
        <div className="absolute right-0.5 top-0.5 w-2 h-2 rounded-full bg-white"></div>
      </div>
    </div>
  ),
  slider: () => (
    <div className="w-full flex items-center space-x-2">
      <span className="text-gray-400">−</span>
      <div className="relative flex-1 h-0.5 bg-gray-200 rounded">
        <div className="absolute top-1/2 left-1/3 transform -translate-y-1/2 w-2 h-2 bg-white border border-gray-500 rounded-full"></div>
      </div>
      <span className="text-gray-400">+</span>
      <span className="text-gray-600 font-medium">8</span>
    </div>
  ),
  numberInput: () => (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <button className="text-teal-500">−</button>
        <div className="text-center text-sm">0</div>
        <button className="text-teal-500">+</button>
      </div>
    </div>
  ),
  imageButton: () => (
    <div className="flex justify-center items-center">
      <div className="w-6 h-6 border border-teal-500 rounded text-teal-500 flex items-center justify-center">
        <svg
          className="w-3 h-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="15" cy="9" r="2" />
          <path d="M3 15l5-5 7 7" />
        </svg>
      </div>
    </div>
  ),
  webPageImage: () => (
    <div className="flex justify-center items-center">
      <div className="w-6 h-6 border border-teal-500 rounded text-teal-500 flex items-center justify-center">
        <svg
          className="w-3 h-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="15" cy="9" r="2" />
          <path d="M3 15l5-5 7 7" />
        </svg>
      </div>
    </div>
  ),
  led: () => (
    <div className="flex justify-center items-center">
      <div className="w-4 h-2 bg-green-500 rounded-t-full"></div>
    </div>
  ),
  label: () => <div className="font-semibold text-lg text-gray-700">112</div>,
  gauge: () => (
    <div className="relative w-full">
      <div className="flex justify-center mb-0.5">
        <div className="w-12 h-6 rounded-t-full border-t-2 border-l-2 border-r-2 border-teal-500 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-medium">42</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <span className="text-xs">0</span>
        <span className="text-xs">100</span>
      </div>
    </div>
  ),
  radialGauge: () => (
    <div className="flex justify-center items-center">
      <div className="relative w-8 h-8">
        <svg viewBox="0 0 36 36">
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#E6E6E6"
            strokeWidth="2"
          />
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#10B981"
            strokeWidth="2"
            strokeDasharray="42, 100"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium">42</span>
        </div>
      </div>
    </div>
  ),
  alarmSound: () => (
    <div className="flex justify-center items-center">
      <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
        <svg
          className="w-2 h-2 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>
  ),
  chart: () => (
    <div className="w-full h-8">
      <div className="h-full grid grid-cols-5 gap-1">
        <div className="flex items-end">
          <div className="w-full bg-indigo-700 h-2"></div>
        </div>
        <div className="flex items-end">
          <div className="w-full bg-indigo-700 h-4"></div>
        </div>
        <div className="flex items-end">
          <div className="w-full bg-indigo-700 h-6"></div>
        </div>
        <div className="flex items-end">
          <div className="w-full bg-indigo-700 h-3"></div>
        </div>
        <div className="flex items-end">
          <div className="w-full bg-indigo-700 h-4"></div>
        </div>
      </div>
      <div className="mt-0.5 grid grid-cols-5 gap-1 text-xs text-gray-500">
        <div>2:30 PM</div>
        <div>2:46 PM</div>
        <div></div>
        <div>3:03 PM</div>
        <div></div>
      </div>
    </div>
  ),
  map: () => (
    <div className="w-full h-8 bg-gray-100 rounded-md relative">
      <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full text-white flex items-center justify-center">
        <div className="text-xs">🔒</div>
      </div>
      <div className="w-full h-full bg-green-50 opacity-60">
        <DeviceMap />
      </div>
    </div>
  ),
  imageGallery: () => (
    <div className="flex justify-center items-center">
      <div className="text-teal-500">
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="14" height="14" rx="2" />
          <path d="M18 8h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-3" />
        </svg>
      </div>
    </div>
  ),
  customChart: () => (
    <div className="w-full h-6">
      <svg viewBox="0 0 100 30" className="w-full h-full">
        <polyline
          points="0,20 20,15 40,25 60,10 80,20"
          fill="none"
          stroke="#10B981"
          strokeWidth="2"
        />
        <polyline
          points="0,15 20,25 40,15 60,20 80,10"
          fill="none"
          stroke="#6B7280"
          strokeWidth="2"
        />
      </svg>
    </div>
  ),
  heatmapChart: () => (
    <div className="w-full">
      <div className="font-semibold mb-0.5 text-xs">Timeline</div>
      <div className="flex space-x-0.5">
        <div className="w-3 h-2 bg-indigo-700"></div>
        <div className="w-3 h-2 bg-indigo-300"></div>
        <div className="w-3 h-2 bg-indigo-100"></div>
      </div>
      <div className="flex justify-between mt-0.5">
        <div className="text-xs">02:13 PM</div>
        <div className="text-xs">02:46 PM</div>
      </div>
    </div>
  ),
  video: () => (
    <div className="w-full">
      <div className="flex justify-end mb-0.5">
        <div className="px-1 py-0.5 text-xs bg-teal-500 text-white rounded">
          BETA
        </div>
      </div>
      <div className="flex justify-center">
        <div className="w-6 h-6 border border-teal-500 rounded flex items-center justify-center text-teal-500">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </div>
  ),
  textInput: () => (
    <div className="w-full">
      <input
        type="text"
        placeholder="Zero"
        readOnly
        className="w-full px-1.5 py-1 border rounded-md text-gray-700"
      />
    </div>
  ),
  terminal: () => (
    <div className="w-full">
      <div className="bg-black text-white p-1 mb-0.5 text-xs font-mono rounded">
        &lt; Power On Power Off Enabled
      </div>
      <div className="bg-black text-white p-1 text-xs font-mono rounded">
        Type here
      </div>
    </div>
  ),
  segmentedSwitch: () => (
    <div className="w-full">
      <div className="flex border rounded-md overflow-hidden">
        <div className="flex-1 bg-green-500 text-white py-1 text-center">
          Zero
        </div>
        <div className="flex-1 bg-white text-gray-700 py-1 text-center">
          One
        </div>
      </div>
    </div>
  ),
  menu: () => (
    <div className="w-full">
      <div className="relative border rounded-md px-1.5 py-1 text-gray-700">
        <div className="flex justify-between items-center">
          <span>Zero</span>
          <svg className="w-2 h-2" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  ),
  modules: () => (
    <div className="w-full">
      <div className="border rounded-md p-1.5">
        <div className="font-medium mb-1">Module</div>
        <div className="flex items-center justify-between mb-1">
          <span>Switch</span>
          <div className="w-4 h-2 bg-green-500 rounded-full relative">
            <div className="absolute right-0 top-0 w-2 h-2 rounded-full bg-white"></div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span>Label</span>
          <span>String</span>
        </div>
      </div>
    </div>
  ),
};

const DraggableWidgetBox = ({ widget }: { widget: Widget }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: widget.id as string,
  });

  const WidgetPreviewComponent = widget?.definition?.type
    ? WidgetPreviews[widget.definition.type]
    : null;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="rounded-lg bg-white p-2 shadow-sm border border-gray-100 hover:shadow-md cursor-grab active:cursor-grabbing transition-shadow"
      onDragStart={(e) => {
        e.dataTransfer.setData("application/json", JSON.stringify(widget));
      }}
    >
      <div className="mb-1 font-medium">
        {widget?.definition?.label || `Widget`}
      </div>
      {WidgetPreviewComponent && <WidgetPreviewComponent />}
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
    position: generateDefaultPosition(),
    settings: {},
  });

  const { add } = useAdd(`/api/devices/${deviceId}/widgets`);

  const handleAddWidget = async (widget: Widget) => {
    try {
      const result = await add(widget);
      if (onWidgetAdded && result?.id) {
        onWidgetAdded(result.id);
      }
    } catch (err) {
      console.error("Failed to add widget:", err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-2 flex items-center gap-2 border-b">
        <WidgetsOutlined className="text-gray-700" />
        <h2 className="text-xl font-medium text-gray-800">Widget Box</h2>
      </div>
      <div className="p-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
        {Object.entries(widgetDefinitions).map(([category, definitions]) => (
          <div key={category} className="mb-3 last:mb-0">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1.5">
              {category}
            </h3>
            <div className="grid grid-cols-1 gap-1.5">
              {definitions.map((definition) => {
                const widget = createWidget(definition);
                return (
                  <div
                    key={definition.type}
                    onDoubleClick={() => handleAddWidget(widget)}
                    className="cursor-pointer"
                  >
                    <DraggableWidgetBox widget={widget} />
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
