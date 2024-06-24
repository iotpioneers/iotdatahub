import React from "react";
import dynamic from "next/dynamic";
import ChannelSkeleton from "./loading";

const ChannelForm = dynamic(() => import("@/components/Channels/ChannelForm"), {
  ssr: false,
  loading: () => <ChannelSkeleton />,
});

const NewChannelPage = () => {
  return <ChannelForm />;
};

export default NewChannelPage;
