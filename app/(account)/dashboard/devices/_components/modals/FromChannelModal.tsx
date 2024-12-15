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
import { AppsOutlined } from "@mui/icons-material";
import AddDeviceFormComponent from "@/components/Forms/AddDeviceForm";

const FromChannelModal = ({
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
          From Channel
        </Typography>
      </DialogTitle>
      <DialogContent>
        {/* Content for "From Channel" modal */}
        <AddDeviceFormComponent />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FromChannelModal;
