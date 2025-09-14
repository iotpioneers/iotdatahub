"use client";

import React from "react";
import { Widget } from "@/types/widgets";
import { cn } from "@/lib/utils";
import WidgetRegistry from "./WidgetComponents";

interface WidgetPreviewProps {
  widget: Widget;
  isOverValidDropZone?: boolean;
}

export const DragDropWidgetPreview: React.FC<WidgetPreviewProps> = ({
  widget,
  isOverValidDropZone = false,
}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-xl border-2 p-1 pointer-events-none",
        "transform transition-all duration-200",
        "w-24 h-16 flex flex-col", // Fixed size for preview
        isOverValidDropZone
          ? "border-green-500 shadow-green-200 scale-105"
          : "border-blue-500 shadow-blue-200",
        "opacity-95",
      )}
      style={{
        transform: "rotate(2deg)", // Slight rotation for visual feedback
      }}
    >
      {/* Widget Title */}
      <div className="flex items-center justify-between mb-2 min-h-[10px]">
        <span className="text-sm font-medium text-gray-700 truncate">
          {widget.definition?.label || "Widget"}
        </span>

        {/* Status indicator */}
        <div
          className={cn(
            "w-1 h-1 rounded-full",
            isOverValidDropZone ? "bg-green-500" : "bg-blue-500",
          )}
        />
      </div>

      {/* Widget Content Preview */}
      <div className="flex-1 flex items-center justify-center">
        <div className="scale-75 origin-center">
          {" "}
          {/* Scale down content slightly */}
          <WidgetRegistry
            widgetId={widget.id}
            type={widget.definition?.type as any}
            value={widget.settings?.value}
            settings={widget.settings ?? {}}
          />
        </div>
      </div>

      {/* Drop status text */}
      <div className="text-xs text-center mt-1">
        <span
          className={cn(
            "font-medium",
            isOverValidDropZone ? "text-green-600" : "text-blue-600",
          )}
        >
          {isOverValidDropZone ? "Drop to add" : "Drag to dashboard"}
        </span>
      </div>
    </div>
  );
};
