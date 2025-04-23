"use client";

import React, { useState } from "react";
import { Button, Modal } from "@mui/material";
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
  const [config, setConfig] = useState<Partial<PinConfig>>({
    ...existingConfig,
    widgetId: widget.id,
    deviceId,
  });
  const [isCreatingDatastream, setIsCreatingDatastream] = useState(false);
  const { showToast } = useToast();

  const handleSave = () => {
    if (!config.pinNumber) {
      showToast("Please select or create a datastream", "error");
      return;
    }

    const fullConfig: PinConfig = {
      id: existingConfig?.id || "",
      widgetId: widget.id,
      deviceId,
      pinType: config.pinType || "VIRTUAL",
      pinNumber: config.pinNumber,
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

    onSave(fullConfig);
    showToast("Configuration saved successfully", "success");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-6xl flex">
        {/* Left Panel - Configuration Options */}
        <div className="flex-1 overflow-y-auto pr-4 max-h-[80vh]">
          <h2 className="text-xl font-bold mb-6">
            {widget.definition?.type?.replace(/_/g, " ")} Settings
          </h2>

          {isCreatingDatastream ? (
            <DatastreamForm
              config={config}
              widget={widget}
              onConfigChange={setConfig}
              onCancel={() => setIsCreatingDatastream(false)}
              onSubmit={() => setIsCreatingDatastream(false)}
            />
          ) : (
            <PinConfigForm
              config={config}
              widget={widget}
              onConfigChange={setConfig}
              onDatastreamCreate={() => setIsCreatingDatastream(true)}
            />
          )}
        </div>

        {/* Right Panel - Widget Preview */}
        <div className="ml-6 flex-shrink-0 flex flex-col items-center">
          <div className="mb-auto"></div>
          <WidgetPreview widget={widget} config={config} />
          <div className="mt-auto"></div>
        </div>

        {/* Action buttons - fixed at bottom */}
        <div className="absolute bottom-6 right-6 flex space-x-2">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            className="bg-teal-500"
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PinConfigModal;
