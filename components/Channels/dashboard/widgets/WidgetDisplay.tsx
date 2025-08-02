"use client";

import { Copy, Trash2, Cpu, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Widget, WidgetType } from "@/types/widgets";
import WidgetRegistry from "./WidgetComponents";
import { cn } from "@/lib/utils";
import PinConfigModal from "./PinConfigModal";
import useFetch from "@/hooks/useFetch";
import { useToast } from "@/hooks/useToast";

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
  onDelete,
  className,
}: WidgetDisplayProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showPinConfig, setShowPinConfig] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  const {
    data: pinConfig,
    isLoading: isPinConfigLoading,
    error: pinConfigError,
    refetch: refetchPinConfig,
  } = useFetch(`/api/devices/${widget.deviceId}/widgets/${widget.id}/pin`);

  const handleSavePinConfig = async (config: any) => {
    if (isSaving) return;

    setIsSaving(true);
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      const savedConfig = await response.json();
      setShowPinConfig(false);
      showToast("Pin configuration saved successfully", "success");

      // Refetch the pin config to update the display
      refetchPinConfig();

      return savedConfig;
    } catch (error) {
      console.error("Error saving pin config:", error);
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

  const handleDeletePinConfig = async () => {
    if (!pinConfig) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this pin configuration?",
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/devices/${widget.deviceId}/widgets/${widget.id}/pin`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to delete pin configuration",
        );
      }

      showToast("Pin configuration deleted successfully", "success");
      refetchPinConfig();
    } catch (error) {
      console.error("Error deleting pin config:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete pin configuration";
      showToast(errorMessage, "error");
    }
  };

  return (
    <div
      className={cn(
        "relative h-full w-full p-2 bg-white rounded-lg shadow-sm border",
        isHovered ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200",
        "transition-all duration-150",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 truncate">
          {widget.settings?.title ||
            widget.definition?.label ||
            "Untitled Widget"}
        </span>

        <div className="flex items-center space-x-1">
          {/* Pin Configuration Status */}
          {isPinConfigLoading && (
            <div
              className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"
              title="Loading pin config..."
            />
          )}

          {pinConfigError && (
            <span title="Error loading pin config">
              <AlertCircle className="w-4 h-4 text-red-500" />
            </span>
          )}

          {pinConfig && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {pinConfig.pinNumber}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {isHovered && (
        <div className="absolute top-0 right-0 flex gap-1 p-1 z-50 action-button">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowPinConfig(true);
            }}
            className={cn(
              "p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors",
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
            className="p-1 bg-white rounded-full shadow-md hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
            title="Duplicate"
          >
            <Copy className="w-3 h-3" />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete?.();
            }}
            className="p-1 bg-white rounded-full shadow-md hover:bg-gray-100 text-red-500 hover:text-red-700 transition-colors"
            title="Delete Widget"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Widget Content */}
      <div className="h-[calc(100%-32px)] w-full flex items-center justify-center p-1 z-10 widget-content">
        <WidgetRegistry
          type={widget.definition?.type as WidgetType}
          value={widget.settings?.value}
          settings={widget.settings ?? {}}
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
