"use client";

import React, { useState } from "react";
import { PencilIcon, TrashIcon, CopyIcon, SettingsIcon } from "lucide-react";
import { Widget, WidgetSettings } from "@/types/widgets";
import WidgetRegistry from "./WidgetComponents";
import { useToast } from "@/hooks/useToast";
import LoadingOverlay from "./LoadingOverlay";
import ConfirmationModal from "./ConfirmationModal";

interface WidgetComponentProps {
  widget: Widget;
  onEdit?: () => void;
  onDelete?: (widgetId: string) => Promise<void>;
  onDuplicate?: (widget: Widget) => Promise<void>;
  onConfig?: () => void;
  onValueChange?: (widgetId: string, value: any) => Promise<void>;
}

export const WidgetComponent: React.FC<WidgetComponentProps> = ({
  widget,
  onEdit,
  onDelete,
  onDuplicate,
  onConfig,
  onValueChange,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleValueChange = async (newValue: any) => {
    try {
      setIsLoading(true);
      if (onValueChange) {
        await onValueChange(widget.id, newValue);
      }
    } catch (error) {
      showToast("Failed to update widget value", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      if (onDelete) {
        await onDelete(widget.id);
      }
    } catch (error) {
      showToast("Failed to delete widget", "error");
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  const handleDuplicate = async () => {
    try {
      setIsLoading(true);
      if (onDuplicate) {
        await onDuplicate(widget);
        showToast("Widget duplicated successfully", "success");
      }
    } catch (error) {
      showToast("Failed to duplicate widget", "error");
    } finally {
      setIsLoading(false);
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
          value={widget.settings?.value}
          color={widget.settings?.color || "#10B981"}
          onChange={handleValueChange}
          settings={widgetSettings}
          onClick={() => {
            if (widget.settings?.onClick) {
              widget.settings.onClick();
            }
          }}
        />

        {/* Widget actions overlay */}
        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1 p-1">
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-1 bg-white rounded shadow hover:bg-gray-100"
              title="Edit"
            >
              <PencilIcon className="w-3 h-3" />
            </button>
          )}
          {onDuplicate && (
            <button
              onClick={handleDuplicate}
              className="p-1 bg-white rounded shadow hover:bg-gray-100"
              title="Duplicate"
            >
              <CopyIcon className="w-3 h-3" />
            </button>
          )}
          {onConfig && (
            <button
              onClick={onConfig}
              className="p-1 bg-white rounded shadow hover:bg-gray-100"
              title="Configure"
            >
              <SettingsIcon className="w-3 h-3" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => setShowConfirm(true)}
              className="p-1 bg-white rounded shadow hover:bg-gray-100"
              title="Delete"
            >
              <TrashIcon className="w-3 h-3 text-red-500" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full relative">
      {renderWidgetContent()}

      <ConfirmationModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Widget"
        message="Are you sure you want to delete this widget?"
        confirmText="Delete"
        cancelText="Cancel"
        isProcessing={isDeleting}
      />

      <LoadingOverlay isLoading={isLoading} />
    </div>
  );
};

export default WidgetComponent;
