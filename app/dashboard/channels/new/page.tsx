import React from "react";
import dynamic from "next/dynamic";
import Loading from "@/app/loading";

const ChannelForm = dynamic(() => import("@/components/Channels/ChannelForm"), {
  ssr: false,
  loading: () => <Loading />,
});

const NewChannelPage = () => {
  return <ChannelForm />;
};

export default NewChannelPage;
