"use client";

import React, { useState } from "react";
import { Widget } from "@/types/widgets";
import { Button, Modal, TextField, Select, MenuItem } from "@mui/material";

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
  const [type, setType] = useState(widget.definition?.type || "");

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

  return (
    <Modal open onClose={onClose}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4">Widget Settings</h2>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Select
          value={type}
          onChange={(e) => setType(e.target.value)}
          fullWidth
          margin="dense"
        >
          <MenuItem value="switch">Switch</MenuItem>
          <MenuItem value="slider">Slider</MenuItem>
          <MenuItem value="numberInput">Number Input</MenuItem>
          <MenuItem value="imageButton">Image Button</MenuItem>
        </Select>
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
  );
};

export default DeviceSettingModal;
