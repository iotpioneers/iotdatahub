"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// material-ui
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

// Project Imports
import { deleteChannel } from "@/lib/actions/room.actions";

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
import { DeleteModalProps } from "@/types";
import LoadingProgressBar from "../../LoadingProgressBar";

export const DeleteChannelModal = ({ channelId }: DeleteModalProps) => {
  const [open, setOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [info, setInfo] = useState<string>("");

  const handleCloseResult = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const deleteChannelHandler = async () => {
    setLoading(true);

    try {
      const response = await deleteChannel(channelId);

      if (!response) {
        setError("Failed to delete channel");
        setShowMessage(true);
        setLoading(false);
      }

      setInfo("Channel deleted successfully");
      setShowMessage(true);
      setLoading(false);
    } catch (error) {
      setError("Failed to delete channel");
      setShowMessage(true);
      setLoading(false);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="min-w-9 justify-center items-center gap-1 rounded-xl  p-2 transition-all my-2">
            <Image
              src="/icons/delete.svg"
              alt="delete"
              width={20}
              height={20}
              className="mt-1"
            />
          </Button>
        </DialogTrigger>
        <DialogContent className="shad-dialog">
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={showMessage}
            autoHideDuration={20000}
            onClose={handleCloseResult}
          >
            <Alert
              onClose={handleCloseResult}
              severity={error ? "error" : "success"}
              variant="filled"
              sx={{ width: "100%" }}
            >
              {error ? error : info}
            </Alert>
          </Snackbar>
          <DialogHeader>
            <Image
              src="/icons/delete-modal.svg"
              alt="delete"
              width={48}
              height={48}
              className="mb-4"
            />
            <DialogTitle>Delete channel</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this channel? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-5">
            <DialogClose asChild className="w-full bg-slate-950 text-white">
              Cancel
            </DialogClose>

            <Button
              type="button"
              variant="contained"
              onClick={deleteChannelHandler}
              className="gradient-red w-full"
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
          {loading && <LoadingProgressBar />}
        </DialogContent>
      </Dialog>
    </>
  );
};
