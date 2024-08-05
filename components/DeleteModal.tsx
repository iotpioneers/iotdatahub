"use client";

import Image from "next/image";
import { useState } from "react";

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
} from "@/components/Actions/dialog";

import { Button } from "@mui/material";
import { DeleteModalProps } from "@/types";
import LoadingProgressBar from "./LoadingProgressBar";

export const DeleteModal = ({ roomId }: DeleteModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const deleteChannelHandler = async () => {
    setLoading(true);

    try {
      await deleteChannel(roomId);

      setOpen(false);
      setLoading(false);
    } catch (error) {
      console.log("Error notif:", error);
      setError("Failed to delete channel");
      setLoading(false);
      setOpen(true);
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="min-w-9 justify-center items-center gap-1 rounded-xl  p-2 transition-all my-2">
          <Image
            src="/assets/icons/delete.svg"
            alt="delete"
            width={20}
            height={20}
            className="mt-1"
          />
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog">
        <DialogHeader>
          <Image
            src="/assets/icons/delete-modal.svg"
            alt="delete"
            width={48}
            height={48}
            className="mb-4"
          />
          <DialogTitle>Delete channel</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this channel? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-5">
          <DialogClose asChild className="w-full bg-slate-950 text-white">
            Cancel
          </DialogClose>

          <Button
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
  );
};
