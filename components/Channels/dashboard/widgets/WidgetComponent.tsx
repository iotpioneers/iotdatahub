"use client";

import React, { useState } from "react";
import { PencilIcon, TrashIcon } from "lucide-react";
import { Widget, WidgetSettings } from "@/types/widgets";
import WidgetRegistry from "./WidgetComponents";

interface WidgetComponentProps {
  widget: Widget;
}

export const WidgetComponent: React.FC<WidgetComponentProps> = ({ widget }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [color, setColor] = useState(widget.settings?.color || "#000000");

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
  };

  const handleValueChange = (newValue: any) => {};

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

  return <div className="w-full h-full">{renderWidgetContent()}</div>;
};

export default WidgetComponent;
