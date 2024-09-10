"use client";

import { useEffect, useState } from "react";

// Project imports
import { ApiKey, Channel, DataPoint, Field, SampleCodes } from "@/types";
import LoadingProgressBar from "@/components/LoadingProgressBar";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getUsers } from "@/lib/actions/user.actions";
import { CollaborationUser } from "@/types/user";
import { getRoomAccess } from "@/lib/actions/room.actions";
import ChannelCollaborationRoom from "@/components/Channels/collaboration/ChannelCollaborationRoom";

interface ChannelData {
  channel: Channel;
  dataPoint: DataPoint[];
  fields: Field[];
  apiKey: ApiKey;
  sampleCodes: SampleCodes;
}

const ChannelDetails = ({ channelID }: { channelID: string }) => {
  const { status, data: session } = useSession();
  const router = useRouter();

  const [channelData, setChannelData] = useState<ChannelData | null>(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentUserType, setCurrentUserType] = useState<"editor" | "viewer">(
    "viewer"
  );
  const [usersData, setUsersData] = useState<any[]>([]);
  const [room, setRoom] = useState<any>(null);

  useEffect(() => {
    if (status !== "loading" && status === "unauthenticated") {
      return;
    }
  }, [status, router]);

  useEffect(() => {
    const fetchChannel = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_BASE_URL + `/api/channels/${channelID}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch channel data");
        }

        const data: ChannelData = await res.json();
        setChannelData(data);
      } catch (error) {
        setError("An error occurred while fetching the channel");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChannel();
  }, [channelID]);

  useEffect(() => {
    const fetchData = async () => {
      if (!channelData || !session?.user) return;

      const userEmail = session.user.email;

      try {
        const roomData = await getRoomAccess({
          roomId: channelID,
          userEmail,
        });

        if (!roomData) {
          setIsLoading(false);
          setError("You do not have access to this channel");
          setOpen(true);
        }

        setRoom(roomData);

        const userIds = Object.keys(roomData.usersAccesses);

        const users = await getUsers({ userIds });

        if (!users) {
          setError("No users found or an error occurred");
          return;
        }

        const usersData = users.map((user: CollaborationUser) => ({
          ...user,
          userType: roomData.usersAccesses[user.email]?.includes("room:write")
            ? "editor"
            : "viewer",
        }));

        setUsersData(usersData);

        const currentUserType = roomData.usersAccesses[userEmail]?.includes(
          "room:write"
        )
          ? "editor"
          : "viewer";

        setCurrentUserType(currentUserType);
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    fetchData();
  }, [channelData]);

  const handleCloseResult = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  if (isLoading) {
    return <LoadingProgressBar />;
  }

  if (!channelData) {
    return <LoadingProgressBar />;
  }

  const {
    channel,
    dataPoint = [],
    fields = [],
    apiKey,
    sampleCodes,
  } = channelData;

  return (
    <main className="overflow-hidden">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        autoHideDuration={12000}
        onClose={handleCloseResult}
      >
        <Alert
          onClose={handleCloseResult}
          severity={error ? "error" : "success"}
          variant="standard"
          sx={{ width: "100%" }}
        >
          {error ? error : "Success"}
        </Alert>
      </Snackbar>
      <ChannelCollaborationRoom
        roomId={channelID}
        roomMetadata={room?.metadata}
        currentUserType={currentUserType}
        channel={channel}
        dataPoint={dataPoint}
        fields={fields}
        apiKey={apiKey}
        sampleCodes={sampleCodes}
      />
    </main>
  );
};

export default ChannelDetails;
