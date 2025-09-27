"use client";

import { useState } from "react";
import { Suspense } from "react";
import useSWR from "swr";
import ChannelListTable from "./ChannelListTable";
import { Text } from "@radix-ui/themes";
import { Button } from "@mui/material";
import { TableSkeleton } from "@/components/ui/UnifiedLoading";
import Image from "next/image";
import type { Channel } from "@/types";
import AddNewChannelModal from "./AddNewChannelModal";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ChannelList = () => {
  const [isModalOpen, setModalOpen] = useState(false);
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
    <div className="w-full pt-5">
      {isLoading && (
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse" />
          <TableSkeleton rows={5} columns={4} />
        </div>
      )}

      <AddNewChannelModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
      />

      {!isLoading && !channels?.length && (
        <div className="capitalize mb-8 w-full flex flex-row justify-between items-center text-center text-2xl max-w-2xl mx-auto">
          <Text>
            Channels are templates assigned to devices, facilitating efficient
            data management and monitoring.
          </Text>
        </div>
      )}

      {!isLoading && (
        <Button
          className="button bg-orange-50 hover:bg-black p-3 rounded-md gap-1 mb-2"
          onClick={() => setModalOpen(true)}
        >
          <Image src="/icons/add.svg" alt="add" width={24} height={24} />
          <p className="block text-white">Add New Channel</p>
        </Button>
      )}

      <Suspense fallback={<TableSkeleton rows={6} columns={5} />}>
        {channels && channels.length > 0 && (
          <ChannelListTable initialChannels={channels} />
        )}
      </Suspense>
    </div>
  );
};

export default ChannelList;
