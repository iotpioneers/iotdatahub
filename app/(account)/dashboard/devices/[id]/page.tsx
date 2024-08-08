import { Suspense } from "react";
import DeviceDetails from "../_components/DeviceDetails";
import LoadingProgressBar from "@/components/LoadingProgressBar";

interface Props {
  params: { id: string };
}

const DeviceDetailsPage = async ({ params }: Props) => {
  return (
    <Suspense fallback={<LoadingProgressBar />}>
      <DeviceDetails params={params} />
    </Suspense>
  );
};

export default DeviceDetailsPage;
