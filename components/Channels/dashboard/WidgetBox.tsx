"use client";

import { ChartBarIcon } from "@heroicons/react/20/solid";
import { NumberCircleOne } from "@phosphor-icons/react";
import { SliderIcon, SwitchIcon } from "@radix-ui/react-icons";
import { GaugeIcon } from "lucide-react";
import { Widget, WidgetDefinition } from "@/types/widgets";
import { useDraggable } from "@dnd-kit/core";
import useAdd from "@/hooks/useAdd";
import { WidgetsOutlined } from "@mui/icons-material";

// Utility function to adjust the default size
const adjustWidgetSize = (
  size: { w: number; h: number },
  reduction: number,
) => ({
  w: size.w - reduction,
  h: size.h - reduction,
});

const generateDefaultPosition = (): { x: number; y: number } => ({
  x: 0,
  y: 0,
});

// Adjust size for all widgets
const adjustedControlWidgetDefinitions: WidgetDefinition[] = [
  {
    type: "switch",
    label: "Switch",
    icon: <SwitchIcon className="w-4 h-4" />,
    defaultSize: adjustWidgetSize({ w: 200, h: 100 }, 10),
    category: "control",
  },
  {
    type: "slider",
    label: "Slider",
    icon: <SliderIcon className="w-4 h-4" />,
    defaultSize: adjustWidgetSize({ w: 200, h: 100 }, 10),
    category: "control",
  },
  {
    type: "numberInput",
    label: "Number Input",
    icon: <NumberCircleOne className="w-4 h-4" />,
    defaultSize: adjustWidgetSize({ w: 200, h: 100 }, 10),
    category: "control",
  },
];

const adjustedDisplayWidgetDefinitions: WidgetDefinition[] = [
  {
    type: "gauge",
    label: "Gauge",
    icon: <GaugeIcon className="w-4 h-4" />,
    defaultSize: adjustWidgetSize({ w: 200, h: 100 }, 10),
    category: "display",
  },
  {
    type: "chart",
    label: "Chart",
    icon: <ChartBarIcon className="w-4 h-4" />,
    defaultSize: adjustWidgetSize({ w: 200, h: 100 }, 10),
    category: "display",
  },
];

const DraggableWidgetBox = ({ widget }: { widget: Widget }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: widget.id as string,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="flex items-center p-2 rounded-md hover:bg-gray-50 cursor-grab active:cursor-grabbing"
      onDragStart={(e) => {
        e.dataTransfer.setData("application/json", JSON.stringify(widget));
      }}
    >
      {widget?.definition?.icon || <WidgetsOutlined />}{" "}
      {widget?.definition?.label || `${widget.position} Widget`}
    </div>
  );
};

const WidgetBox = ({ deviceId }: { deviceId: string }) => {
  const createWidget = (definition: WidgetDefinition): Widget => ({
    id: `${definition.type}-${Date.now()}`,
    definition,
    position: generateDefaultPosition(),
    settings: {},
  });

  const { add } = useAdd(`/api/devices/${deviceId}/widgets`);

  const handleAddWidget = async (widget: Widget) => {
    try {
      await add(widget);
      console.log("Widget added successfully");
    } catch (err) {
      console.error("Failed to add widget:", err);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-500 mb-2">CONTROL</h3>
        <div className="space-y-2">
          {adjustedControlWidgetDefinitions.map((definition) => {
            const widget = createWidget(definition);
            return (
              <div
                key={definition.type}
                onDoubleClick={() => handleAddWidget(widget)}
              >
                <DraggableWidgetBox widget={widget} />
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-500 mb-2">DISPLAY</h3>
        <div className="space-y-2">
          {adjustedDisplayWidgetDefinitions.map((definition) => {
            const widget = createWidget(definition);
            return (
              <div
                key={definition.type}
                onDoubleClick={() => handleAddWidget(widget)}
              >
                <DraggableWidgetBox widget={widget} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WidgetBox;
