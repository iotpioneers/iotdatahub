"use client";

import { useEffect, useState } from "react";
import Navigation from "@/components/device/Navigation";
import PageHeading from "@/components/device/PageHeading";
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
export default function Device({ params }: Props) {
  const [channelDetails, setChannelDetails] = useState<ChannelData | null>(
    null
  );

  useEffect(() => {
    const fetchChannel = async () => {
      const res = await fetch(
        `http://localhost:3000/api/channels/${params.id}`
      );
      const channelData: ChannelData = await res.json();

      console.log("channelData:--", channelData);

      setChannelDetails(channelData);
    };

    fetchChannel();
  }, [params.id]);

  if (!channelDetails) {
    return <Loading />;
  }

  const { channel } = channelDetails;

  return (
    <main className="overflow-hidden">
      <PageHeading channel={channel} />
      <div className="mt-10 border-t border-gray-200"></div>
      <Navigation channelId={params.id} />
    </main>
  );
}
