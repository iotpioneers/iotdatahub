"use client";

import { useEffect, useState } from "react";
import ChannelNavigation from "@/components/Channels/ChannelNavigation";
import { ChannelProps, DataPointProps, FieldProps } from "@/types";
import dynamic from "next/dynamic";
import LoadingProgressBar from "@/components/LoadingProgressBar";

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

  useEffect(() => {
    const fetchChannel = async () => {
      const res = await fetch(
        `http://localhost:3000/api/channels/${channelID}`
      );
      const channelData: ChannelData = await res.json();

      setChannelData(channelData);
    };

    fetchChannel();
  }, []);

  if (!channelData) {
    return;
  }

  const { channel, dataPoint, fields, apiKey, sampleCodes } = channelData;

  return (
    <main className="overflow-hidden">
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
