import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { QrCodeScannerOutlined } from "@mui/icons-material";

const ScanQRModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h1" fontWeight="bold">
          Scan QR Code
        </Typography>
      </DialogTitle>
      <DialogContent>
        {/* Content for "Scan QR Code" modal */}
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <QrCodeScannerOutlined fontSize="large" />
          <Typography variant="body1">
            Scan the QR code on your device using the camera
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Box display="flex" alignItems="center" gap={1}>
          <QrCodeScannerOutlined />
          <Typography variant="body1">
            Point on the cards to see instructions
          </Typography>
        </Box>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScanQRModal;
