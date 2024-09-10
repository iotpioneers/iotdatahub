import { Suspense } from "react";
import ChannelDetails from "../_components/ChannelDetails";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Metadata } from "next";

interface Props {
  params: { id: string };
}

export default function ChannelDetailsPage({ params }: Props) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ChannelDetails channelID={params.id} />
    </Suspense>
  );
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Channel Details - IoTDataHub - Dashboard",
  description:
    "View all project channels and devices data storage location and control options for each channel",
};
