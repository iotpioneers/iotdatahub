"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { ApiKey, Channel, DataPoint, Field, SampleCodes } from "@/types";
import LoadingProgressBar from "@/components/LoadingProgressBar";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { getUsers } from "@/lib/actions/user.actions";
import { getRoomAccess } from "@/lib/actions/room.actions";
import ChannelCollaborationRoom from "@/components/Channels/collaboration/ChannelCollaborationRoom";

interface ChannelData {
  channel: Channel;
  dataPoint: DataPoint[];
  fields: Field[];
  apiKey: ApiKey;
  sampleCodes: SampleCodes;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ChannelDetails = ({ channelID }: { channelID: string }) => {
  const { status, data: session } = useSession();

  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>("");
  const [currentUserType, setCurrentUserType] = useState<"editor" | "viewer">(
    "viewer"
  );
  const [room, setRoom] = useState<any>(null);

  const { data: channelData, error: channelError } = useSWR<ChannelData>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/channels/${channelID}`,
    fetcher
  );

  useEffect(() => {
    if (status !== "loading" && status === "unauthenticated") {
      return;
    }
  }, [status]);

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!channelData || !session?.user?.email) return;

      try {
        const roomData = await getRoomAccess({
          roomId: channelID,
          userEmail: session.user.email,
        });

        if ("error" in roomData) {
          setError(roomData.error);
          setOpen(true);
          return;
        }

        setRoom(roomData);

        const userIds = Object.keys(roomData.usersAccesses);
        const users = await getUsers({ userIds });

        if (!users) {
          setError("No users found or an error occurred");
          return;
        }

        const currentUserType = roomData.usersAccesses[
          session.user.email
        ]?.includes("room:write")
          ? "editor"
          : "viewer";

        setCurrentUserType(currentUserType);
      } catch (error) {
        console.error("Error fetching room data:", error);
        setError("An error occurred while fetching room data");
      }
    };

    fetchRoomData();
  }, [channelData, session]);

  const handleCloseResult = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  if (channelError) return <div>Failed to load channel data</div>;
  if (!channelData) return <LoadingProgressBar />;

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
