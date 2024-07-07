"use client";

import { useEffect, useState } from "react";
import ChannelNavigation from "@/components/device/ChannelNavigation";
import { ChannelProps, DataPointProps, FieldProps } from "@/types";
import PageHeading from "@/components/device/PageHeading";

interface Props {
  params: { id: string };
}

interface ChannelData {
  channel: ChannelProps;
  dataPoint: DataPointProps[];
  fields: FieldProps[];
}

export default function ChannelDetails({ params }: Props) {
  const [channelData, setChannelData] = useState<ChannelData | null>(null);

  useEffect(() => {
    const fetchChannel = async () => {
      const res = await fetch(
        `http://localhost:3000/api/channels/${params.id}`
      );
      const channelData: ChannelData = await res.json();

      setChannelData(channelData);
    };

    fetchChannel();
  }, []);

  if (!channelData) {
    return;
  }

  const { channel } = channelData;

  return (
    <main className="overflow-hidden">
      {/* Render PageHeading dynamically */}
      <PageHeading channel={channel} />
      <div className="mt-10 border-t border-gray-200"></div>
      <ChannelNavigation channelId={params.id} />
    </main>
  );
}
