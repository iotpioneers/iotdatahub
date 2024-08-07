"use client";

import { useEffect, useState } from "react";
import ChannelNavigation from "@/components/Channels/ChannelNavigation";
import { ChannelProps, DataPointProps, FieldProps } from "@/types";
import dynamic from "next/dynamic";
import LoadingProgressBar from "@/components/LoadingProgressBar";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

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
  const [channelData, setChannelData] = useState<ChannelData | null>(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  useEffect(() => {
    const fetchChannel = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_BASE_URL + `/api/channels/${channelID}`
        );

        if (!res.ok) {
          const errorData = await res.json();
          setError("Failed to fetch channel");
          setIsLoading(false);
          return;
        }

        const channelData: ChannelData = await res.json();

        if (!channelData) {
          setError("Failed to fetch channel");
          setIsLoading(false);
          return;
        }

        setChannelData(channelData);
      } catch (error) {
        setError("An error occurred while fetching the channel");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChannel();
  }, [channelData]);

  if (!channelData) {
    return;
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
      {isLoading && <LoadingProgressBar />}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        autoHideDuration={6000}
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
      <ChannelDetailsHeading
        channel={channel}
        dataReceived={dataPoint.length}
      />
      <div className="mt-10 border-t border-gray-200"></div>
      <ChannelNavigation
        channelId={channelID}
        fields={fields}
        dataPoint={dataPoint}
        sampleCodes={sampleCodes}
        apiKey={apiKey}
      />
    </main>
  );
}
