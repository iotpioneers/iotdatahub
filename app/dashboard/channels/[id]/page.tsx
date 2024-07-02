"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import ChannelNavigation from "@/components/device/ChannelNavigation";
import { ChannelProps, DataPointProps, FieldProps } from "@/types";
import Loading from "@/app/loading";

interface Props {
  params: { id: string };
}

interface ChannelData {
  channel: ChannelProps;
  dataPoint: DataPointProps[];
  fields: FieldProps[];
}

// Dynamic import for PageHeading to prevent SSR issues
const PageHeading = dynamic(() => import("@/components/device/PageHeading"), {
  ssr: false,
});

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
