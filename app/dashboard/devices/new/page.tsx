import LoadingSpinner from "@/components/LoadingSpinner";
import dynamic from "next/dynamic";

const DeviceForm = dynamic(() => import("@/components/Forms/DeviceForm"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

export default function Newdevice() {
  return <DeviceForm />;
}
