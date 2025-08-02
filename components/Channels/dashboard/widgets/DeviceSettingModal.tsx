"use client";

import React, { useState } from "react";
import { Widget } from "@/types/widgets";
import { Button, Modal, TextField } from "@mui/material";
import PinConfigModal from "./PinConfigModal";
import useFetch from "@/hooks/useFetch";

interface DeviceSettingModalProps {
  widget: Widget;
  onClose: () => void;
  onUpdate: (widget: Widget) => void;
}

const DeviceSettingModal: React.FC<DeviceSettingModalProps> = ({
  widget,
  onClose,
  onUpdate,
}) => {
  const [name, setName] = useState(widget.settings?.title || "");
  const [showPinConfig, setShowPinConfig] = useState(false);
  const { data: pinConfig } = useFetch(
    `/api/devices/${widget.deviceId}/widgets/${widget.id}/pin`,
  );

  const handleSave = () => {
    onUpdate({
      ...widget,
      settings: {
        ...widget.settings,
        title: name,
      },
    });
    onClose();
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
    <>
      <Modal open onClose={onClose}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-lg font-bold mb-4">Widget Settings</h2>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
          />

          <div className="mt-4">
            <Button
              variant="outlined"
              fullWidth
              onClick={() => setShowPinConfig(true)}
            >
              {pinConfig ? "Edit Pin Configuration" : "Configure Pin"}
            </Button>
            {pinConfig && (
              <div className="mt-2 text-sm">
                Current Pin: {pinConfig.pinNumber} ({pinConfig.pinType})
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <Button onClick={onClose} className="mr-2">
              Cancel
            </Button>
            <Button onClick={handleSave} variant="contained" color="primary">
              Save
            </Button>
          </div>
        </div>
      </Modal>

      <PinConfigModal
        open={showPinConfig}
        onClose={() => setShowPinConfig(false)}
        widget={widget}
        deviceId={widget.deviceId || ""}
        onSave={handleSavePinConfig}
        existingConfig={pinConfig}
      />
    </>
  );
};

export default DeviceSettingModal;
