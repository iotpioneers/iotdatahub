"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
} from "@mui/material";
import type { DeviceData } from "@/types/device";

interface EditDeviceModalProps {
  open: boolean;
  onClose: () => void;
  device: DeviceData | null;
  isLoading: boolean;
  onSave: (updatedDevice: Partial<DeviceData>) => Promise<void>;
}

const EditDeviceModal = ({
  open,
  onClose,
  device,
  isLoading,
  onSave,
}: EditDeviceModalProps) => {
  const [formData, setFormData] = React.useState<Partial<DeviceData>>({
    name: "",
    // Add other fields as needed
  });

  React.useEffect(() => {
    if (device) {
      setFormData({
        name: device.name,
        // Set other fields
      });
    }
  }, [device]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{ "& .MuiDialog-paper": { borderRadius: 12 } }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>Edit Device</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              name="name"
              label="Device Name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              disabled={isLoading}
            />
            {/* Add other fields as needed */}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditDeviceModal;
