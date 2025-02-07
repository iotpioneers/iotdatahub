"use client";

import React, { useState } from "react";
import { PencilIcon, TrashIcon } from "lucide-react";
import { Widget, WidgetSettings } from "@/types/widgets";
import WidgetRegistry from "./WidgetComponents";

interface WidgetComponentProps {
  widget: Widget;
  onUpdate?: (widget: Widget) => void;
  onDelete?: (widgetId: string) => void;
  isResizing?: boolean;
}

export const WidgetComponent: React.FC<WidgetComponentProps> = ({
  widget,
  onUpdate,
  onDelete,
  isResizing,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [color, setColor] = useState(widget.settings?.color || "#000000");

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    if (onUpdate) {
      onUpdate({
        ...widget,
        settings: { ...widget.settings, color: newColor },
      });
    }
  };

  const handleValueChange = (newValue: any) => {
    if (onUpdate) {
      onUpdate({
        ...widget,
        settings: { ...widget.settings, value: newValue },
      });
    }
  };

  const handleSettingsChange = (newSettings: Partial<WidgetSettings>) => {
    if (onUpdate) {
      onUpdate({
        ...widget,
        settings: { ...widget.settings, ...newSettings },
      });
    }
  };

  const renderWidgetContent = () => {
    if (!widget.definition?.type) return null;

    const widgetSettings = widget.settings
      ? {
          ...widget.settings,
          max: widget.settings.max,
          min: widget.settings.min,
          options: widget.settings.options,
        }
      : undefined;

    return (
      <div className="w-full h-full flex items-center justify-center">
        <WidgetRegistry
          type={widget.definition.type}
          value={widget.settings?.value}
          color={color}
          onChange={handleValueChange}
          settings={widgetSettings}
          onClick={() => {
            if (widget.settings?.onClick) {
              widget.settings.onClick();
            }
          }}
          data={widget.settings?.data}
        />
      </div>
    );
  };

  return (
    <div className="w-full h-full">
      <div className="bg-orange-50 rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
        <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-gray-100">
          <div className="text-sm font-medium text-gray-700">
            {widget.definition?.label + " - " + widget.id ||
              widget.definition?.label}
          </div>
          {/* <div className="flex items-center gap-1">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete?.(widget.id)}
              className="p-1 hover:bg-gray-100 rounded text-red-500"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div> */}
        </div>
        <div
          className={`flex-1 p-4 transition-opacity duration-200 ${isResizing ? "opacity-50" : "opacity-100"}`}
        >
          {renderWidgetContent()}
        </div>

        {isEditing && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg p-4 rounded-lg z-10 border border-gray-200">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-full"
                />
              </div>
              {widget.definition?.type === "gauge" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Value
                  </label>
                  <input
                    type="number"
                    value={widget.settings?.max || 100}
                    onChange={(e) =>
                      handleSettingsChange({ max: Number(e.target.value) })
                    }
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
              )}
              {(widget.definition?.type === "label" ||
                widget.definition?.type === "textInput") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={widget.settings?.title || ""}
                    onChange={(e) =>
                      handleSettingsChange({ title: e.target.value })
                    }
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WidgetComponent;
