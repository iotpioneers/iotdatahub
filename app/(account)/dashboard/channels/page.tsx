import React, { Suspense } from "react";
import ChannelList from "./_components/ChannelList";
import LoadingProgressBar from "@/components/LoadingProgressBar";
import { Metadata } from "next";

const ChannelsPage = () => {
  return (
    <Suspense fallback={<LoadingProgressBar />}>
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
