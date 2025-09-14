import { Suspense } from "react";
import DeviceDetails from "../_components/DeviceDetails";
import { LinearLoading } from "@/components/LinearLoading";

interface Props {
  params: { id: string };
}

const DeviceDetailsPage = async ({ params }: Props) => {
  return (
    <Suspense fallback={<LinearLoading />}>
      <DeviceDetails params={params} />
    </Suspense>
  );
};

export default DeviceDetailsPage;
