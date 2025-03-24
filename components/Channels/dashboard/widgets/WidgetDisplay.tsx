"use client";

import { Copy, Settings, Trash2 } from "lucide-react";
import { useState } from "react";
import { Widget } from "@/types/widgets";
import WidgetRegistry from "./WidgetComponents";
import { cn } from "@/lib/utils";

interface WidgetDisplayProps {
  widget: Widget;
  onDuplicate?: () => void;
  onSettings?: () => void;
  onDelete?: () => void;
  className?: string;
}

export const WidgetDisplay = ({
  widget,
  onDuplicate,
  onSettings,
  onDelete,
  className,
}: WidgetDisplayProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "relative h-full w-full p-1 group bg-white rounded-lg shadow-lg border border-gray-200",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between px-2 py-1">
        <span className="text-xs font-medium text-gray-600 truncate">
          {widget.settings?.title || widget.definition?.label}
        </span>
      </div>

      {/* Widget Content - with higher z-index */}
      <div className="h-[calc(100%-24px)] w-full flex items-center justify-center p-1 z-10">
        <WidgetRegistry
          type={widget.definition?.type as any}
          value={widget.settings?.value}
          settings={widget.settings ?? {}}
        />
      </div>

      {/* Action Buttons - with proper z-index and pointer-events */}
      <div className="absolute top-0 right-0 flex gap-1 p-1 z-20">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDuplicate?.();
          }}
          className="p-1 bg-white rounded-full shadow-md hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
          title="Duplicate"
        >
          <Copy className="w-3 h-3" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSettings?.();
          }}
          className="p-1 bg-white rounded-full shadow-md hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
          title="Settings"
        >
          <Settings className="w-3 h-3" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete?.();
          }}
          className="p-1 bg-white rounded-full shadow-md hover:bg-gray-100 text-red-500 hover:text-red-700 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
