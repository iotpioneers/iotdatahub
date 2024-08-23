"use client";

import Image from "next/image";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Actions/DialogActions";
import { Button } from "@mui/material";
import LoadingProgressBar from "../LoadingProgressBar";

interface CustomModalProps {
  triggerComponent: React.ReactNode;
  title: string;
  description: string;
  warning?: string;
  confirmButtonText: string;
  onConfirm: () => Promise<void>;
  iconSrc: string;
}

export const ActionModal: React.FC<CustomModalProps> = ({
  triggerComponent,
  title,
  warning,
  description,
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
    setOpen(false);
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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{triggerComponent}</DialogTrigger>
        <DialogContent className="action-dialog">
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={showMessage}
            autoHideDuration={20000}
            onClose={handleCloseResult}
          >
            <Alert
              onClose={handleCloseResult}
              severity={"error"}
              variant="filled"
              sx={{ width: "100%" }}
            >
              {error}
            </Alert>
          </Snackbar>
          <DialogHeader>
            <Image
              src={iconSrc}
              alt="icon"
              width={48}
              height={48}
              className="mb-4"
            />
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
            <DialogDescription className="text-red-400">
              {warning}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-5">
            <DialogClose asChild className="w-full bg-slate-950 text-white">
              Cancel
            </DialogClose>

            <Button
              type="button"
              variant="contained"
              onClick={handleConfirm}
              className="gradient-red w-full"
            >
              {loading ? "Processing..." : confirmButtonText}
            </Button>
          </DialogFooter>
          {loading && <LoadingProgressBar />}
        </DialogContent>
      </Dialog>
    </>
  );
};
