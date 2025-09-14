"use client";

import { Copy, Trash2, Cpu, AlertCircle, Undo, Settings } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Widget, WidgetType } from "@/types/widgets";
import WidgetRegistry from "./WidgetComponents";
import { cn } from "@/lib/utils";
import PinConfigModal from "./PinConfigModal";
import { useToast } from "@/hooks/useToast";

interface WidgetDisplayProps {
  widget: Widget;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onUpdate?: (changes: Partial<Widget>) => void;
  className?: string;
}

export const WidgetDisplay = ({
  widget,
  onDuplicate,
  onDelete,
  onUpdate,
  className,
}: WidgetDisplayProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showPinConfig, setShowPinConfig] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pinConfig, setPinConfig] = useState<any>(null);
  const [pinConfigError, setPinConfigError] = useState<string | null>(null);
  const { showToast } = useToast();
  const [deleted, setDeleted] = useState(false);
  const undoTimeoutRef = useRef<NodeJS.Timeout>();

  // Load pin config from widget or localStorage on mount
  useEffect(() => {
    const loadPinConfig = () => {
      try {
        // First try to get from widget data
        if (widget.pinConfig) {
          setPinConfig(widget.pinConfig);
        } else {
          // Fallback to localStorage for backward compatibility
          const storedConfig = localStorage.getItem(
            `widget-pin-config-${widget.id}`,
          );
          if (storedConfig) {
            const parsedConfig = JSON.parse(storedConfig);
            setPinConfig(parsedConfig);

            // If we found config in localStorage but not in widget,
            // update the widget to include it
            if (onUpdate) {
              onUpdate({ pinConfig: parsedConfig });
            }
          }
        }
      } catch (error) {
        throw new Error("Error loading pin config");
      }
    };

    loadPinConfig();
  }, [widget.id, widget.pinConfig, onUpdate]);

  const handleSavePinConfig = async (config: any) => {
    setIsSaving(true);
    try {
      // Validate config
      if (!config.pinNumber) {
        throw new Error("Pin number is required");
      }

      // Store locally for immediate feedback
      localStorage.setItem(
        `widget-pin-config-${widget.id}`,
        JSON.stringify(config),
      );

      // Update local state
      setPinConfig(config);

      // **KEY FIX**: Update the widget in the parent component's state
      // This ensures the pin config is included in the pending changes
      if (onUpdate) {
        onUpdate({
          pinConfig: config,
          // Also update widget name if title changed
          name: config.title || widget.name,
          // Update settings to include pin config values
          settings: {
            ...widget.settings,
            ...config,
            title: config.title || widget.settings?.title,
            color: config.widgetColor || widget.settings?.color,
            min: config.minValue || widget.settings?.min,
            max: config.maxValue || widget.settings?.max,
            value:
              config.defaultValue !== undefined
                ? config.defaultValue
                : widget.settings?.value,
          },
        });
      }

      setShowPinConfig(false);
      showToast("Pin configuration saved", "success");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to save pin configuration";
      showToast(errorMessage, "error");
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onDelete) {
      onDelete();
      setDeleted(true);

      // Show undo option for 5 seconds
      undoTimeoutRef.current = setTimeout(() => {
        setDeleted(false);
      }, 5000);
    }
  };

  const handleUndoDelete = () => {
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
    }
    setDeleted(false);
    // Note: You'll need to implement undo logic in the parent component
  };

  if (deleted) {
    return (
      <div
        className={cn(
          "relative h-full w-full p-4 bg-gray-100 rounded-lg border border-dashed border-gray-300",
          "flex flex-col items-center justify-center",
          className,
        )}
      >
        <div className="text-sm text-gray-500 mb-2">Widget deleted</div>
        <button
          onClick={handleUndoDelete}
          className="flex items-center text-sm text-blue-500 hover:text-blue-700"
        >
          <Undo className="w-4 h-4 mr-1" />
          Undo
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative h-full w-full p-3 bg-white transition-all duration-150",
        isHovered ? "ring-2 ring-blue-200" : "",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Widget Title Header */}
      <div className="flex items-center justify-between mb-2 min-h-[20px]">
        <span className="text-sm font-medium text-gray-700 truncate flex-1 mr-2 capitalize">
          {widget.name ||
            widget.settings?.widgetType ||
            widget.definition?.type ||
            "Untitled"}
        </span>

        {/* Pin Config Indicator (when not hovered) */}
        {pinConfig && !isHovered && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {pinConfig.pinNumber}
          </span>
        )}

        {pinConfigError && !isHovered && (
          <AlertCircle className="w-4 h-4 text-red-500" />
        )}
      </div>

      {/* Action Buttons - Only show on hover */}
      {isHovered && (
        <div className="absolute top-2 right-2 flex gap-1 z-50 action-button">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowPinConfig(true);
            }}
            className={cn(
              "p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors",
              pinConfig
                ? "text-blue-600 hover:text-blue-800"
                : "text-gray-600 hover:text-gray-900",
            )}
            title={pinConfig ? "Edit Pin Configuration" : "Configure Pin"}
            disabled={isSaving}
          >
            <Cpu className="w-3 h-3" />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDuplicate?.();
            }}
            className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
            title="Duplicate"
          >
            <Copy className="w-3 h-3" />
          </button>

          <button
            onClick={handleDelete}
            className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 text-red-500 hover:text-red-700 transition-colors"
            title="Delete Widget"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Widget Content */}
      <div
        className="flex-1 flex items-center justify-center widget-content"
        style={{
          height: "calc(100% - 24px)", // Adjusted for smaller header
          minHeight: "24px", // Ensure minimum height
        }}
      >
        <WidgetRegistry
          widgetId={widget.id}
          type={widget.definition?.type as WidgetType}
          value={widget.settings?.value}
          settings={widget.settings ?? {}}
          className="w-full h-full" // Ensure widget fills container
        />
      </div>

      {/* Loading Overlay */}
      {isSaving && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-600">Saving...</span>
          </div>
        </div>
      )}

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
