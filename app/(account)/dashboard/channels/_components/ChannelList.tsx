"use client";

import React, { useState } from "react";
import { Suspense } from "react";
import useSWR from "swr";
import ChannelListTable from "./ChannelListTable";
import { Text } from "@radix-ui/themes";
import { Button } from "@mui/material";
import LoadingProgressBar from "@/components/LoadingProgressBar";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Channel } from "@/types";
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

  console.log("channels", !channels?.length);
  

  return (
    <div className="w-full pt-5">
      {isLoading && <LoadingProgressBar />}
    
      <AddNewChannelModal open={isModalOpen} onClose={() => setModalOpen(false)} />

      {!isLoading && !channels?.length && (
          <div className="capitalize mb-8 w-full flex flex-row justify-between items-center text-center text-2xl max-w-2xl mx-auto">
            <Text>Channels are templates assigned to devices, facilitating efficient
              data management and monitoring.
            </Text>
          </div>
        )}

        <Button
        className="button bg-orange-50 hover:bg-black p-3 rounded-md gap-1 mb-2"
        onClick={() => setModalOpen(true)}
      >
        <Image src="/icons/add.svg" alt="add" width={24} height={24} />
        <p className="block text-white">Add New Channel</p>
      </Button>


      <Suspense fallback={<LoadingSpinner />}>
        {channels && channels.length > 0 && (
          <ChannelListTable initialChannels={channels} />
        )}
      </Suspense>
    </div>
  );
};

export default ChannelList;
