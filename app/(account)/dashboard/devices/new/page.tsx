import LoadingProgressBar from "@/components/LoadingProgressBar";
import dynamic from "next/dynamic";

const DeviceForm = dynamic(() => import("@/components/Forms/DeviceForm"), {
  ssr: false,
  loading: () => <LoadingProgressBar />,
});

export default function Newdevice() {
  return <DeviceForm />;
}
