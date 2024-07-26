import React from "react";
import dynamic from "next/dynamic";
import LoadingProgressBar from "@/components/LoadingProgressBar";

const ChannelForm = dynamic(() => import("@/components/Forms/ChannelForm"), {
  ssr: false,
  loading: () => <LoadingProgressBar />,
});

const NewChannelPage = () => {
  return <ChannelForm />;
};

export default NewChannelPage;
