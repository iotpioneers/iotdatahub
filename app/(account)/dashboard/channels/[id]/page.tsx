import { Suspense } from "react";
import ChannelDetails from "../_components/ChannelDetails";
import LoadingSpinner from "@/components/LoadingSpinner";

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
