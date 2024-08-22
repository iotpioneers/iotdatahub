"use client";

import { Suspense, useEffect, useState } from "react";
import ProjectList from "./ProjectList";
import { Text } from "@radix-ui/themes";
import Link from "next/link";
import { Button } from "@mui/material";
import LoadingProgressBar from "@/components/LoadingProgressBar";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Channel } from "@/types";
import axios from "axios";

const ChannelList = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [channels, setChannels] = useState<Channel[] | []>([]);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          process.env.NEXT_PUBLIC_BASE_URL + "/api/channels"
        );
        if (res.status !== 200) {
          throw new Error("Failed to fetch channels");
        }
        const channelsData: Channel[] = await res.data;
        setChannels(channelsData);
      } catch (error) {
        return null;
      } finally {
        setIsLoading(false);
      }
    };

    fetchChannels();
  }, [channels.length]);

  return (
    <div className="w-full">
      {isLoading && <LoadingProgressBar />}
      <Link href="/dashboard/channels/new" onClick={() => setIsLoading(true)}>
        <Button className="button bg-gray-600 p-3 rounded-md gap-1 mb-2">
          <Image src="/icons/add.svg" alt="add" width={24} height={24} />
          <p className="block">Add New Channel</p>
        </Button>
      </Link>

      {channels && channels.length === 0 && !isLoading && (
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
        {channels && channels.length > 0 && (
          <ProjectList initialChannels={channels} />
        )}
      </Suspense>
    </div>
  );
};

export default ChannelList;
