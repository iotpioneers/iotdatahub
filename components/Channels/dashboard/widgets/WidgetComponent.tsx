"use client";

import React, { useState } from "react";
import { Widget } from "@/types/widgets";
import WidgetRegistry from "./WidgetComponents";
import { useToast } from "@/hooks/useToast";

interface WidgetComponentProps {
  widget: Widget;
  onValueChange?: (widgetId: string, value: any) => Promise<void>;
}

export const WidgetComponent: React.FC<WidgetComponentProps> = ({
  widget,
  onValueChange,
}) => {
  console.log("====================================");
  console.log("Received widget data:", widget);
  console.log("====================================");

  const { showToast } = useToast();

  const handleValueChange = async (newValue: any) => {
    try {
      if (onValueChange) {
        await onValueChange(widget.id, newValue);
      }
    } catch (error) {
      showToast("Failed to update widget value", "error");
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
      <div className="w-full h-full flex items-center justify-center relative group">
        <WidgetRegistry
          type={widget.definition.type}
          value={widget.value || widget.settings?.value}
          color={widget.settings?.color || "#10B981"}
          onChange={handleValueChange}
          settings={widgetSettings}
          onClick={() => {
            if (widget.settings?.onClick) {
              widget.settings.onClick();
            }
          }}
        />
      </div>
    );
  };

  return <div className="w-full h-full relative">{renderWidgetContent()}</div>;
};

export default WidgetComponent;
