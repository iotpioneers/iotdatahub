import React, { Suspense } from "react";
import ChannelList from "./_components/ChannelList";
import LoadingProgressBar from "@/components/LoadingProgressBar";

const ChannelsPage = () => {
  return (
    <Suspense fallback={<LoadingProgressBar />}>
      <ChannelList />
    </Suspense>
  );
};

export default ChannelsPage;
