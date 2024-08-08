"use client";

import { Suspense, useEffect, useState } from "react";
import ProjectList from "./ProjectList";
import { Text } from "@radix-ui/themes";
import Link from "next/link";
import { Button } from "@mui/material";
import LoadingProgressBar from "@/components/LoadingProgressBar";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Channel {
  id: number;
  name: string;
  description: string;
  lastSeen: Date | null;
  lastSeenDateTime: Date;
}

const ChannelList = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [channels, setChannels] = useState<Channel[] | null>(null);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          process.env.NEXT_PUBLIC_BASE_URL + "/api/channels"
        );
        if (!res.ok) {
          throw new Error("Failed to fetch channels");
        }
        const channelsData: Channel[] = await res.json();
        setChannels(channelsData);
      } catch (error) {
        return null;
      } finally {
        setIsLoading(false);
      }
    };

    fetchChannels();
  }, [channels?.length]);

  return (
    <div className="w-full">
      {isLoading && <LoadingProgressBar />}
      <Link href="/dashboard/channels/new" onClick={() => setIsLoading(true)}>
        <Button className="button bg-gray-600 p-3 rounded-md gap-1 mb-2">
          <Image src="/assets/icons/add.svg" alt="add" width={24} height={24} />
          <p className="block">Add New Channel</p>
        </Button>
      </Link>

      {!isLoading && (!channels || channels.length === 0) && (
        <div className="mb-8 w-full flex flex-row justify-between items-center text-center max-w-2xl mx-auto">
          <Text>
            Channels serve as a fundamental structure for organizing and storing
            data. Each channel can accommodate various data fields, each capable
            of holding different data types (e.g., temperature, humidity).
            Channels are templates assigned to devices, facilitating efficient
            data management and monitoring.
          </Text>
        </div>
      )}

      <Suspense fallback={<LoadingSpinner />}>
        {channels && channels.length > 0 && <ProjectList />}
      </Suspense>
    </div>
  );
};

export default ChannelList;
