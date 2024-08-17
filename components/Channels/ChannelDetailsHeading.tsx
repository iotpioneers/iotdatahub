"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { CalendarIcon } from "@heroicons/react/20/solid";
import { ChartPieIcon } from "@heroicons/react/24/solid";
import { ChannelHeadingProps } from "@/types";
import { Input } from "@/components/Actions/TextEditingInput";

import { updateChannelRoomData } from "@/lib/actions/room.actions";
import { ViewIcon } from "lucide-react";
import { dateConverter } from "@/lib/utils";

import InviteCollaboratorModal from "./collaboration/InviteCollaboratorModal";
import ActiveCollaborators from "./collaboration/ActiveCollaborators";

const ChannelDetailsHeading = ({
  roomId,
  roomMetadata,
  users,
  currentUserType,
  channel,
  dataPoint,
}: ChannelHeadingProps) => {
  const { id: channelId } = channel;

  const [channelTitle, setChannelTitle] = useState(channel?.name);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const [showResult, setShowResult] = useState(false);

  const handleCloseResult = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setShowResult(false);
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!channel) {
    return null;
  }

  const updateChannelTitleHandler = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      setLoading(true);
      setError("");

      try {
        if (channelTitle !== channel?.name) {
          const updatedChannel = await updateChannelRoomData(
            channelId,
            channelTitle
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
        console.log("Error updating channel", error);
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
        updateChannelRoomData(channelId, channelTitle);
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
    <div className="lg:flex lg:items-center lg:justify-between mt-12 padding-x padding-y max-width">
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
              className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:tracking-tight"
            />
          ) : (
            <>
              <p className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:tracking-tight">
                {channelTitle}
              </p>
            </>
          )}

          {currentUserType === "editor" && !editing && (
            <Image
              src="/icons/edit.svg"
              alt="edit"
              width={24}
              height={24}
              onClick={() => setEditing(true)}
              className="pointer"
            />
          )}

          {currentUserType !== "editor" && (
            <p className="view-only-tag">
              <ViewIcon width={12} height={12} /> View only
            </p>
          )}
          {loading && <p className="text-sm text-gray-400">saving...</p>}
        </div>

        <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <ChartPieIcon
              className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
              aria-hidden="true"
            />
            Generated {dataPoint.length} data
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <CalendarIcon
              className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
              aria-hidden="true"
            />
            Created about {dateConverter(channel.createdAt.toString())}
          </div>
        </div>
        <div className="flex justify-between items-center my-5 ">
          {roomMetadata && (
            <InviteCollaboratorModal
              roomId={roomId}
              collaborators={users}
              creator={roomMetadata.creatorId}
              currentUserType={currentUserType}
            />
          )}
          <ActiveCollaborators />
        </div>
      </div>
    </div>
  );
};

export default ChannelDetailsHeading;
