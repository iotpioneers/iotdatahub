"use client";

import type React from "react";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import type { ApiKey, Channel, DataPoint, Field } from "@/types/uni-types";
import { getUsers } from "@/lib/actions/user.actions";
import { getRoomAccess } from "@/lib/actions/room.actions";
import ChannelCollaborationRoom from "@/components/Channels/collaboration/ChannelCollaborationRoom";
import { useToast } from "@/components/ui/toast-provider";
import LoadingProgressBar from "@/components/loading-progress-bar";

interface ChannelData {
  channel: Channel;
  dataPoint: DataPoint[];
  fields: Field[];
  apiKey: ApiKey;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    (error as any).info = await res.json();
    (error as any).status = res.status;
    throw error;
  }
  return res.json();
};

interface ChannelDetailsProps {
  channelID: string;
}

const ChannelDetails: React.FC<ChannelDetailsProps> = ({ channelID }) => {
  const { data: session } = useSession();
  const [currentUserType, setCurrentUserType] = useState<"editor" | "viewer">(
    "viewer"
  );
  const [room, setRoom] = useState<any>(null);
  const toast = useToast();

  const { data: channelData, error: channelError } = useSWR<ChannelData>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/channels/${channelID}`,
    fetcher,
    { refreshInterval: 5000 }
  );

  useEffect(() => {
    if (channelError) {
      toast.toast({
        type: "error",
        message: `Failed to load channel data: ${channelError.message}`,
      });
    }
  }, [channelError, toast]);

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!channelData || !session?.user?.email) return;

      try {
        const roomData = await getRoomAccess({
          roomId: channelID,
          userEmail: session.user.email,
        });

        if ("error" in roomData) {
          toast.toast({
            type: "error",
            message: roomData.error,
          });
          return;
        }

        setRoom(roomData);

        const userIds = Object.keys(roomData.usersAccesses);
        const users = await getUsers({ userIds });

        if (!users) {
          toast.toast({
            type: "error",
            message: "No users found or an error occurred",
          });
          return;
        }

        const currentUserType = roomData.usersAccesses[
          session.user.email
        ]?.includes("room:write")
          ? "editor"
          : "viewer";

        setCurrentUserType(currentUserType);
      } catch (error) {
        toast.toast({
          type: "error",
          message: "An error occurred while fetching room data",
        });
      }
    };

    fetchRoomData();
  }, [channelData, session, toast]);

  if (channelError) return <div>Failed to load channel data</div>;
  if (!channelData) return <LoadingProgressBar />;

  const { channel, dataPoint = [], fields = [], apiKey } = channelData;

  return (
    <main>
      <ChannelCollaborationRoom
        roomId={channelID}
        roomMetadata={room?.metadata}
        currentUserType={currentUserType}
        channel={channel}
        dataPoint={dataPoint}
        fields={fields}
        apiKey={apiKey}
      />
    </main>
  );
};

export default ChannelDetails;
