"use client";

import React, { useState, useEffect } from "react";
import { Button, Modal, CircularProgress, Alert } from "@mui/material";
import PinConfigForm from "./PinConfigForm";
import DatastreamForm from "./DatastreamForm";
import WidgetPreview from "./WidgetPreview";
import { PinConfig, PinConfigModalProps } from "@/types/pin-config";
import { useToast } from "@/hooks/useToast";

const PinConfigModal: React.FC<PinConfigModalProps> = ({
  open,
  onClose,
  widget,
  deviceId,
  onSave,
  existingConfig,
}) => {
  const [config, setConfig] = useState<Partial<PinConfig>>({});
  const [isCreatingDatastream, setIsCreatingDatastream] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { showToast } = useToast();

  // Initialize config when modal opens or existingConfig changes
  useEffect(() => {
    if (open) {
      const initialConfig = {
        ...existingConfig,
        widgetId: widget.id,
        deviceId,
        // Set defaults based on widget type
        title:
          existingConfig?.title || widget.settings?.title || widget.name || "",
        pinType: existingConfig?.pinType || "VIRTUAL",
        widgetType: existingConfig?.widgetType || widget.definition?.type,
        valueType:
          existingConfig?.valueType ||
          getDefaultValueType(widget.definition?.type),
        widgetColor:
          existingConfig?.widgetColor || widget.settings?.color || "#10B981",
        showLabels: existingConfig?.showLabels || false,
        hideWidgetName: existingConfig?.hideWidgetName || false,
        onValue: existingConfig?.onValue || "1",
        offValue: existingConfig?.offValue || "0",
        minValue: existingConfig?.minValue || widget.settings?.min || 0,
        maxValue: existingConfig?.maxValue || widget.settings?.max || 100,
        defaultValue:
          existingConfig?.defaultValue ||
          widget.settings?.value ||
          getDefaultValue(widget.definition?.type),
      };
      setConfig(initialConfig);
      setHasUnsavedChanges(false);
      setError(null);
    }
  }, [open, existingConfig, widget, deviceId]);

  const getDefaultValueType = (
    widgetType?: string,
  ): "BOOLEAN" | "NUMBER" | "STRING" => {
    switch (widgetType) {
      case "switch":
      case "toggle":
      case "led":
        return "BOOLEAN";
      case "slider":
      case "gauge":
      case "radialGauge":
      case "numberInput":
        return "NUMBER";
      default:
        return "STRING";
    }
  };

  const getDefaultValue = (widgetType?: string) => {
    switch (widgetType) {
      case "switch":
      case "toggle":
      case "led":
        return false;
      case "slider":
      case "gauge":
      case "radialGauge":
      case "numberInput":
        return 0;
      default:
        return "";
    }
  };

  const handleConfigChange = (newConfig: Partial<PinConfig>) => {
    setConfig(newConfig);
    setHasUnsavedChanges(true);
    setError(null);
  };

  const validateConfiguration = (): string | null => {
    if (!config.pinNumber) {
      return "Please select or create a datastream";
    }

    if (config.valueType === "NUMBER") {
      if (
        config.minValue !== undefined &&
        config.maxValue !== undefined &&
        config.minValue >= config.maxValue
      ) {
        return "Minimum value must be less than maximum value";
      }
    }

    // Widget-specific validations
    const widgetType = widget.definition?.type;
    if (
      (widgetType === "switch" || widgetType === "toggle") &&
      config.valueType === "BOOLEAN"
    ) {
      if (!config.onValue || !config.offValue) {
        return "ON and OFF values are required for boolean switches";
      }
    }

    return null;
  };

  const handleSave = async () => {
    const validationError = validateConfiguration();
    if (validationError) {
      setError(validationError);
      showToast(validationError, "error");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const fullConfig: PinConfig = {
        id: existingConfig?.id || "",
        widgetId: widget.id,
        deviceId,
        pinType: config.pinType || "VIRTUAL",
        widgetType: config.widgetType || widget.definition?.type || "VIRTUAL",
        pinNumber: config.pinNumber!,
        valueType: config.valueType || "BOOLEAN",
        defaultValue: config.defaultValue || "",
        minValue: config.minValue || 0,
        maxValue: config.maxValue || 100,
        createdAt: existingConfig?.createdAt || new Date(),
        updatedAt: new Date(),
        title: config.title || widget.name || "",
        showLabels: config.showLabels || false,
        hideWidgetName: config.hideWidgetName || false,
        onValue: config.onValue || "1",
        offValue: config.offValue || "0",
        widgetColor: config.widgetColor || "#10B981",
        automationType: config.automationType || "",
      };

      await onSave(fullConfig);
      setHasUnsavedChanges(false);
      showToast("Configuration saved successfully", "success");
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save configuration";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      const confirmClose = window.confirm(
        "You have unsaved changes. Are you sure you want to close?",
      );
      if (!confirmClose) return;
    }
    setHasUnsavedChanges(false);
    setError(null);
    onClose();
  };

  const handleDatastreamCreated = (datastreamConfig: Partial<PinConfig>) => {
    setConfig((prev) => ({ ...prev, ...datastreamConfig }));
    setIsCreatingDatastream(false);
    setHasUnsavedChanges(true);
    showToast("Datastream created successfully", "success");
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      disableEscapeKeyDown={hasUnsavedChanges}
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">
            {widget.definition?.type?.replace(/_/g, " ").toUpperCase()} Settings
          </h2>
          {hasUnsavedChanges && (
            <p className="text-sm text-orange-600 mt-1">
              You have unsaved changes
            </p>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mt-4">
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Configuration Options */}
          <div className="flex-1 overflow-y-auto p-6">
            {isCreatingDatastream ? (
              <DatastreamForm
                config={config}
                widget={widget}
                onConfigChange={handleConfigChange}
                onCancel={() => setIsCreatingDatastream(false)}
                onSubmit={handleDatastreamCreated}
              />
            ) : (
              <PinConfigForm
                config={config}
                widget={widget}
                onConfigChange={handleConfigChange}
                onDatastreamCreate={() => setIsCreatingDatastream(true)}
              />
            )}
          </div>

          {/* Right Panel - Widget Preview */}
          <div className="w-80 border-l border-gray-200 p-6 flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Preview</h3>
            <div className="flex-1 flex items-center justify-center">
              <WidgetPreview widget={widget} config={config} />
            </div>
          </div>
        </div>

        {/* Footer with Action Buttons */}
        <div className="border-t border-gray-200 p-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {isLoading && <CircularProgress size={20} />}
            {hasUnsavedChanges && (
              <span className="text-sm text-orange-600">Unsaved changes</span>
            )}
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outlined"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={isLoading || !hasUnsavedChanges}
              className="bg-teal-500 hover:bg-teal-600"
            >
              {isLoading ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PinConfigModal;
