import React from "react";
import dynamic from "next/dynamic";
import ChannelFormSkeleton from "./loading";

const ChannelForm = dynamic(() => import("@/components/Channels/ChannelForm"), {
  ssr: false,
  loading: () => <ChannelFormSkeleton />,
});

const NewChannelPage = () => {
  return <ChannelForm />;
};

export default NewChannelPage;
