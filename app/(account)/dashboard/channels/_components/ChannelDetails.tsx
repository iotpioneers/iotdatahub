"use client";

import { useEffect, useState } from "react";
import ChannelNavigation from "@/components/Channels/ChannelNavigation";
import { ChannelProps, DataPointProps, FieldProps } from "@/types";
import dynamic from "next/dynamic";
import LoadingProgressBar from "@/components/LoadingProgressBar";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getUsersById } from "@/lib/actions/user.actions";
import { User } from "@/types/user";
import { getRoomAccess } from "@/lib/actions/room.actions";
import ChannelCollaborationRoom from "@/components/Channels/collaboration/ChannelCollaborationRoom";

const ChannelDetailsHeading = dynamic(
  () => import("@/components/Channels/ChannelDetailsHeading"),
  {
    ssr: false,
    loading: () => <LoadingProgressBar />,
  }
);

interface ChannelData {
  channel: ChannelProps;
  dataPoint: DataPointProps[];
  fields: FieldProps[];
  apiKey: string;
  sampleCodes: string;
}

export default function ChannelDetails({ channelID }: { channelID: string }) {
  const { status, data: session } = useSession();
  const router = useRouter();

  const [channelData, setChannelData] = useState<ChannelData | null>(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentUserType, setCurrentUserType] = useState<"editor" | "viewer">(
    "editor"
  );
  const [usersData, setUsersData] = useState<any[]>([]);
  const [room, setRoom] = useState<any>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
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

      const { organizationId: roomId } = channelData.channel;
      const userId = session.user.id;
      const userEmail = session.user.email;

      try {
        const roomData = await getRoomAccess({ roomId, userId, userEmail });
        if (!roomData) return;

        setRoom(roomData);

        const userIds = Object.keys(roomData.usersAccesses);
        const users = await getUsersById({ userIds });

        if (!users || users.length === 0) return;

        const usersData = users.map((user: User) => ({
          ...user,
          userType: roomData.usersAccesses[userId]?.includes("room:write")
            ? "editor"
            : "viewer",
        }));

        setUsersData(usersData);

        const currentUserType = roomData.usersAccesses[userId]?.includes(
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
    return <div>No channel data available</div>;
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
        roomId={channel.organizationId}
        roomMetadata={room?.metadata}
        users={usersData}
        currentUserType={currentUserType}
        channel={channel}
        dataPoint={dataPoint}
        fields={fields}
        apiKey={apiKey}
        sampleCodes={sampleCodes}
      />
    </main>
  );
}
