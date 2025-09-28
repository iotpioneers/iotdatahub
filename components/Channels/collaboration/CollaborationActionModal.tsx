"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LoadingProgressBar from "@/components/loading-progress-bar";

interface CustomModalProps {
  triggerComponent: React.ReactNode;
  title: string;
  description: string;
  warning?: string;
  confirmButtonText: string;
  onConfirm: () => Promise<void>;
  iconSrc: string;
}

export const CollaborationActionModal: React.FC<CustomModalProps> = ({
  triggerComponent,
  title,
  description,
  warning,
  confirmButtonText,
  onConfirm,
  iconSrc,
}) => {
  const [open, setOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleCloseResult = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setShowMessage(false);
  };

  const handleConfirm = async () => {
    setLoading(true);
    setShowMessage(false);
    try {
      await onConfirm();
    } catch (error) {
      setError("Operation failed");
      setShowMessage(true);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      {React.cloneElement(triggerComponent as React.ReactElement, {
        onClick: () => setOpen(true),
      })}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Image src={iconSrc} alt="icon" width={32} height={32} />
            <Typography variant="h2" gutterBottom sx={{ mt: 1 }}>
              {title}
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => setOpen(false)}
              aria-label="close"
              style={{ position: "absolute", right: 18, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </div>
          {loading && <LoadingProgressBar />}
        </DialogTitle>
        <DialogContent>
          <div style={{ marginBottom: 16 }}>
            <Typography variant="h4" gutterBottom sx={{ mt: 1 }}>
              {description}
            </Typography>
            {warning && (
              <Typography
                variant="h4"
                gutterBottom
                sx={{ mt: 2, color: "red" }}
              >
                {warning}
              </Typography>
            )}
          </div>
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={showMessage}
            autoHideDuration={6000}
            onClose={handleCloseResult}
          >
            <Alert
              onClose={handleCloseResult}
              severity="error"
              variant="filled"
              sx={{ width: "100%" }}
            >
              {error}
            </Alert>
          </Snackbar>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Processing..." : confirmButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
