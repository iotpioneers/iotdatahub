"use client";

import { useState } from "react";
import { PowerIcon } from "lucide-react";
import { Button, Snackbar, Alert, AlertColor } from "@mui/material";

interface DeviceControlProps {
  deviceId: string;
  initialStatus: "ONLINE" | "OFFLINE" | "DISCONNECTED";
  onStatusChange?: (newStatus: "ONLINE" | "OFFLINE" | "DISCONNECTED") => void;
}

interface SnackbarMessage {
  message: string;
  severity: AlertColor;
}

const DeviceControl = ({
  deviceId,
  initialStatus,
  onStatusChange,
}: DeviceControlProps) => {
  const [status, setStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null);
  const [open, setOpen] = useState(false);

  const handleCloseSnackbar = () => {
    setOpen(false);
    setSnackbar(null);
  };

  const showSnackbar = (message: string, severity: AlertColor) => {
    setSnackbar({ message, severity });
    setOpen(true);
  };

  const toggleDevice = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/devices/${deviceId}/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to toggle device");
      }

      const updatedDevice = await response.json();
      setStatus(updatedDevice.status);
      onStatusChange?.(updatedDevice.status);

      showSnackbar(
        `Device ${
          updatedDevice.status === "ONLINE" ? "activated" : "deactivated"
        } successfully`,
        "success"
      );
    } catch (error) {
      showSnackbar("Failed to toggle device status", "error");
      console.error("Error toggling device:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={toggleDevice}
        disabled={isLoading}
        variant={status === "ONLINE" ? "contained" : "outlined"}
        sx={{
          width: { xs: "100%", sm: "auto" },
        }}
        startIcon={<PowerIcon />}
      >
        {status === "ONLINE" ? "Turn Off" : "Turn On"}
      </Button>

      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <>
          {snackbar && (
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              sx={{ width: "100%" }}
              variant="filled"
            >
              {snackbar.message}
            </Alert>
          )}
        </>
      </Snackbar>
    </>
  );
};

export default DeviceControl;
