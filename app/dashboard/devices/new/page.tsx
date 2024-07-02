import dynamic from "next/dynamic";

const DeviceForm = dynamic(() => import("@/components/Forms/DeviceForm"), {
  ssr: false,
});

export default function Newdevice() {
  return <DeviceForm />;
}
