"use client";

import { Suspense, useEffect, useState } from "react";
import ProjectList from "./ProjectList";
import { Heading, Text } from "@radix-ui/themes";
import ChannelAction from "@/components/device/ChannelAction";
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
        const res = await fetch("http://localhost:3000/api/channels");
        if (!res.ok) {
          throw new Error("Failed to fetch channels");
        }
        const channelsData: Channel[] = await res.json();
        setChannels(channelsData);
      } catch (error) {
        console.error("Error fetching channels:", error);
        // Handle error state or retry logic if needed
      } finally {
        setIsLoading(false);
      }
    };

    fetchChannels();
  }, []);

  // Render loading spinner while fetching channels
  if (isLoading || channels === null) {
    return;
  }

  return (
    <div className="w-full">
      <Suspense fallback={<LoadingSpinner />}>
        {channels.length === 0 && (
          <div className="mb-8 flex flex-col items-center text-center max-w-2xl mx-auto">
            <Heading as="h3" className="mb-5">
              Start by creating your first channel
            </Heading>
            <Text className="m-5">
              Channels serve as a fundamental structure for organizing and
              storing data. Each channel can accommodate various data fields,
              each capable of holding different data types (e.g., temperature,
              humidity). Channels are templates assigned to devices,
              facilitating efficient data management and monitoring.
            </Text>
          </div>
        )}
      </Suspense>

      <div className="flex justify-between items-center mb-8">
        <ChannelAction />
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        {channels.length > 0 && <ProjectList />}
      </Suspense>
    </div>
  );
};

export default ChannelList;
