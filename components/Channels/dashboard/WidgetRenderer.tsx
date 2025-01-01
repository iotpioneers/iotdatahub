"use client";

import React from "react";
import type { Widget } from "@/types/widgets";
import { Switch } from "./widgets/Switch";
import { Slider } from "./widgets/Slider";
import { NumberInput } from "./widgets/NumberInput";
// Import other widget components

interface Props {
  widget: Widget;
  onSettingsChange: (settings: any) => void;
  onDelete: () => void;
}

const WidgetRenderer: React.FC<Props> = ({
  widget,
  onSettingsChange,
  onDelete,
}) => {
  const renderWidget = () => {
    switch (widget.type) {
      case "switch":
        return (
          <Switch settings={widget.settings} onChange={onSettingsChange} />
        );
      case "slider":
        return (
          <Slider settings={widget.settings} onChange={onSettingsChange} />
        );
      case "numberInput":
        return (
          <NumberInput settings={widget.settings} onChange={onSettingsChange} />
        );
      // Add other widget cases
      default:
        return <div>Unsupported widget type</div>;
    }
  };

  return (
    <div className="widget-container h-full">
      <div className="widget-drag-handle p-2 bg-gray-50 flex justify-between items-center">
        <span className="text-sm font-medium">
          {widget.settings.title || "Untitled Widget"}
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() =>
              onSettingsChange({ ...widget.settings, isEditing: true })
            }
            className="p-1 hover:bg-gray-200 rounded"
          >
            ⚙️
          </button>
          <button
            onClick={onDelete}
            className="p-1 hover:bg-gray-200 rounded text-red-500"
          >
            ✕
          </button>
        </div>
      </div>
      <div className="p-4">{renderWidget()}</div>
    </div>
  );
};

export default WidgetRenderer;
