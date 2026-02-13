"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { ViewIcon } from "lucide-react";

import { updateChannelRoomData } from "@/lib/actions/room.actions";
import { Input } from "@/components/Actions/TextEditingInput";
import { ChannelHeadingProps } from "@/types";

import { LinearLoading } from "../LinearLoading";

const ChannelDetailsHeading = ({
  roomId,
  roomMetadata,
  currentUserType,
  channel,
  dataPoint,
}: ChannelHeadingProps) => {
  const [channelTitle, setChannelTitle] = useState(channel?.name);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const [showResult, setShowResult] = useState(false);

  const handleCloseResult = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setShowResult(false);
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!channel) {
    return <LinearLoading />;
  }

  const updateChannelTitleHandler = async (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      setLoading(true);
      setError("");

      try {
        if (channelTitle !== channel?.name) {
          const updatedChannel = await updateChannelRoomData(
            roomId,
            channelTitle,
          );

          if (!updatedChannel) {
            setError("Failed to update channel");
            setShowResult(true);
            setEditing(false);
            setLoading(false);
            return;
          }

          setShowResult(true);
          setEditing(false);
          setLoading(false);
        }
      } catch (error) {
        setError((error as Error).message);
        setShowResult(true);
      } finally {
        setLoading(false);
        setEditing(false);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setEditing(false);
        updateChannelRoomData(roomId, channelTitle);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [channel!.id, channelTitle]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  return (
    <div className="lg:flex lg:items-center lg:justify-between padding-x padding-y max-width">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showResult}
        autoHideDuration={12000}
        onClose={handleCloseResult}
      >
        <Alert
          onClose={handleCloseResult}
          severity={error && error !== "" ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {error && error !== "" ? error : "Channel updated successfully"}
        </Alert>
      </Snackbar>

      <div className="min-w-0 flex-1">
        <div
          ref={containerRef}
          className="flex w-fit items-center justify-center gap-2"
        >
          {editing && !loading ? (
            <Input
              type="text"
              value={channelTitle}
              ref={inputRef}
              placeholder="Enter channel name here"
              onChange={(e) => setChannelTitle(e.target.value)}
              onKeyDown={updateChannelTitleHandler}
              disabled={!editing}
              className="text-lg font-semibold leading-7 text-gray-900 sm:text-xl sm:tracking-tight"
            />
          ) : (
            <>
              <h1 className="text-2xl font-bold text-yellow-500">
                {channelTitle}
              </h1>
            </>
          )}

          {!loading && currentUserType === "editor" && !editing && (
            <Image
              src="/icons/edit.svg"
              alt="edit"
              width={24}
              height={24}
              onClick={() => setEditing(true)}
              className="pointer"
            />
          )}

          {!loading && currentUserType !== "editor" && (
            <p className="view-only-tag">
              <ViewIcon width={12} height={12} /> View only
            </p>
          )}
          {loading && <p className="text-sm text-gray-400">saving...</p>}
        </div>
      </div>
    </div>
  );
};

export default ChannelDetailsHeading;
