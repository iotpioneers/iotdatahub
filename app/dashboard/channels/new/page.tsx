import React from "react";
import dynamic from "next/dynamic";
import LoadingSpinner from "@/components/LoadingSpinner";

const ChannelForm = dynamic(() => import("@/components/Forms/ChannelForm"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

const NewChannelPage = () => {
  return <ChannelForm />;
};

export default NewChannelPage;
