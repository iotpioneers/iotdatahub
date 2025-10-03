"use client";

import React from "react";
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
          widgetId={widget.id}
          type={widget.definition.type}
          value={widget.value || widget.settings?.value}
          deviceId={widget.device?.id}
          pinNumber={widget.settings?.pinNumber?.replace("V", "")}
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
