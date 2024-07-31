"use client";

import React, { useEffect, useRef, useState } from "react";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";
import Image from "next/image";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { CalendarIcon, LinkIcon, MapPinIcon } from "@heroicons/react/20/solid";
import { ChartPieIcon } from "@heroicons/react/24/solid";
import ReactMarkdown from "react-markdown";
import { Box, Button, Card, Flex } from "@radix-ui/themes";
import { ChannelProps } from "@/types";
import { Input } from "@/components/ui/input";

import { updateChannelRoom, getChannelRoom } from "@/lib/actions/room.actions";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { getUsersByEmails } from "@/lib/actions/user.actions";
import { User } from "@/types/user";
import { ViewIcon } from "lucide-react";
import { Editor } from "../editor/Editor";
import Loader from "../Loader";

interface ChannelHeadingProps {
  channel: ChannelProps;
  dataReceived: number;
}

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

const ChannelDetailsHeading = ({
  channel,
  dataReceived,
}: ChannelHeadingProps) => {
  const { status, data: session } = useSession();

  if (status === "unauthenticated") {
    redirect("/login");
  }

  const [channelTitle, setChannelTitle] = useState(channel?.name);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [currentUserType, setCurrentUserType] = useState<"editor" | "viewer">(
    "viewer"
  );
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
          const updatedChannel = await updateChannelRoom(
            channel.id,
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
        }
      } catch (error) {
        setError((error as Error).message);
        setShowResult(true);
        console.error(error);
      }

      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setEditing(false);
        updateChannelRoom(channel.id, channelTitle);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [channel.id, channelTitle]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const fetchData = async () => {
    const currentUserEmail = session?.user?.email;

    if (!currentUserEmail) {
      throw new Error("User email is not defined");
    }

    const room = await getChannelRoom({
      roomId: channel.id,
      userId: currentUserEmail,
    });

    if (!room) return;

    // const userIds = Object.keys(room.usersAccesses);
    // const users = await getUsersByEmails({ userIds });

    // if (!users || users.length === 0) return;

    // const usersData = users.map((user: User) => {
    //   if (!user.email) {
    //     return {
    //       ...user,
    //       userType: "viewer",
    //     };
    //   }

    //   return {
    //     ...user,
    //     userType: room.usersAccesses[user.email]?.includes("room:write")
    //       ? "editor"
    //       : "viewer",
    //   };
    // });

    const currentUserType = room.usersAccesses[currentUserEmail]?.includes(
      "room:write"
    )
      ? "editor"
      : "viewer";

    setCurrentUserType(currentUserType);
  };

  useEffect(() => {
    fetchData();
  }, [channel.id, session]);

  return (
    <RoomProvider id={channel.id}>
      <ClientSideSuspense fallback={<Loader />}>
        <div className="lg:flex lg:items-center lg:justify-between mt-12 padding-x padding-y max-width">
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={showResult}
            autoHideDuration={6000}
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
                  placeholder="Enter title"
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
                  src="/assets/icons/edit.svg"
                  alt="edit"
                  width={24}
                  height={24}
                  onClick={() => setEditing(true)}
                  className="pointer"
                />
              )}

              {currentUserType !== "editor" && !editing && (
                <p className="view-only-tag">
                  <ViewIcon width={12} height={12} /> View only
                </p>
              )}
              {loading && <p className="text-sm text-gray-400">saving...</p>}
            </div>

            <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <MapPinIcon
                  className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                Kicukiro, Rwanda
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <ChartPieIcon
                  className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                Generated {dataReceived} data
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <CalendarIcon
                  className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                Created on {formatDate(channel.createdAt)}
              </div>
            </div>
            <div className="mt-5">
              <Editor
                roomId={channel.id}
                currentUserType={currentUserType}
                content={channel.description}
              />
            </div>
          </div>
        </div>
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default ChannelDetailsHeading;
