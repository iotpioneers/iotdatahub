import { Suspense } from "react";
import DeviceDetails from "../_components/DeviceDetails";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Props {
  params: { id: string };
}

const DeviceDetailsPage = async ({ params }: Props) => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DeviceDetails params={params} />
    </Suspense>
  );
};

export default DeviceDetailsPage;
