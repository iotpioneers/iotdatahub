import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import { KeyboardOutlined } from "@mui/icons-material";

const ManualEntryModal = ({
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
          Manual Entry
        </Typography>
      </DialogTitle>
      <DialogContent>
        {/* Content for "Manual Entry" modal */}
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <KeyboardOutlined fontSize="large" />
          <Typography variant="body1">
            Enter the code provided with the device (it's usually placed below
            QR code)
          </Typography>
          <TextField label="Code" variant="outlined" />
        </Box>
      </DialogContent>
      <DialogActions>
        <Box display="flex" alignItems="center" gap={1}>
          <KeyboardOutlined />
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

export default ManualEntryModal;
