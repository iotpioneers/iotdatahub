import React, { Suspense } from "react";
import ChannelList from "./_components/ChannelList";
import LoadingSpinner from "@/components/LoadingSpinner";

const ChannelsPage = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ChannelList />;
    </Suspense>
  );
};

export default ChannelsPage;
