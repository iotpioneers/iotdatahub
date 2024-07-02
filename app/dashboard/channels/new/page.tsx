import React from "react";
import dynamic from "next/dynamic";
import Loading from "@/app/loading";

const ChannelForm = dynamic(() => import("@/components/Forms/ChannelForm"), {
  ssr: false,
});

const NewChannelPage = () => {
  return <ChannelForm />;
};

export default NewChannelPage;
