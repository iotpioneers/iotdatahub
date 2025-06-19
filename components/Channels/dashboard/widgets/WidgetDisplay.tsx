"use client";

import { Copy, Settings, Trash2, Cpu } from "lucide-react";
import { useState } from "react";
import { Widget, WidgetType } from "@/types/widgets";
import WidgetRegistry from "./WidgetComponents";
import { cn } from "@/lib/utils";
import PinConfigModal from "./PinConfigModal";
import useFetch from "@/hooks/useFetch";

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
  const [isActive, setIsActive] = useState(false);
  const [showPinConfig, setShowPinConfig] = useState(false);
  const { data: pinConfig, isLoading } = useFetch(
    `/api/devices/${widget.deviceId}/widgets/${widget.id}/pin`,
  );

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsActive(true);
  };

  const handleSavePinConfig = async (config: any) => {
    try {
      const response = await fetch(
        `/api/devices/${widget.deviceId}/widgets/${widget.id}/pin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(config),
        },
      );
      if (!response.ok) throw new Error("Failed to save pin config");
      setShowPinConfig(false);
    } catch (error) {
      console.error("Error saving pin config:", error);
    }
  };

  return (
    <div
      className={cn(
        "relative h-full w-full p-2 bg-white rounded-lg shadow-sm border",
        isActive ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200",
        "transition-all duration-150",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 truncate">
          {widget.settings?.title || widget.definition?.label}
        </span>
        {pinConfig && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {pinConfig.pinNumber}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      {(isHovered || isActive) && (
        <div className="absolute top-0 right-0 flex gap-1 p-1 z-50 action-button">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowPinConfig(true);
            }}
            className="p-1 bg-white rounded-full shadow-md hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
            title="Configure Pin"
          >
            <Cpu className="w-3 h-3" />
          </button>
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
      )}

      {/* Widget Content */}
      <div className="h-[calc(100%-24px)] w-full flex items-center justify-center p-1 z-10 widget-content">
        <WidgetRegistry
          type={widget.definition?.type as WidgetType}
          value={widget.settings?.value}
          settings={widget.settings ?? {}}
        />
      </div>

      <PinConfigModal
        open={showPinConfig}
        onClose={() => setShowPinConfig(false)}
        widget={widget}
        deviceId={widget.deviceId || ""}
        onSave={handleSavePinConfig}
        existingConfig={pinConfig}
      />
    </div>
  );
};
