"use client";

import { Suspense } from "react";
import useSWR from "swr";
import ChannelListTable from "./ChannelListTable";
import { Text } from "@radix-ui/themes";
import Link from "next/link";
import { Button } from "@mui/material";
import LoadingProgressBar from "@/components/LoadingProgressBar";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Channel } from "@/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ChannelList = () => {
  const {
    data: channels,
    error,
    isLoading,
  } = useSWR<Channel[]>(
    process.env.NEXT_PUBLIC_BASE_URL + "/api/channels",
    fetcher,
    { refreshInterval: 5000 }
  );

  if (error) return <div>Failed to load channels</div>;

  return (
    <div className="w-full">
      {isLoading && <LoadingProgressBar />}
      <Link href="/dashboard/channels/new">
        <Button className="button bg-gray-600 p-3 rounded-md gap-1 mb-2">
          <Image src="/icons/add.svg" alt="add" width={24} height={24} />
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
          <ChannelListTable initialChannels={channels} />
        )}
      </Suspense>
    </div>
  );
};

export default ChannelList;
