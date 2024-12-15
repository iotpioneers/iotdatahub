import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import DeviceDetails from "../_components/DeviceDetails";

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
