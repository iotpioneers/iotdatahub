import { Suspense } from "react";
import ChannelDetails from "../_components/ChannelDetails";
import LoadingProgressBar from "@/components/LoadingProgressBar";

interface Props {
  params: { id: string };
}

export default function ChannelDetailsPage({ params }: Props) {
  return (
    <Suspense fallback={<LoadingProgressBar />}>
      <ChannelDetails channelID={params.id} />
    </Suspense>
  );
}
