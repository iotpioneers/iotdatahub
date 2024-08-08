import React, { Suspense } from "react";
import ChannelList from "./_components/ChannelList";
import { Metadata } from "next";
import LoadingSpinner from "@/components/LoadingSpinner";

const ChannelsPage = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ChannelList />
    </Suspense>
  );
};

export default ChannelsPage;

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Channels - IoTDataHub - Dashboard",
  description:
    "View all project channels and devices data storage location and control options for each channel",
};
