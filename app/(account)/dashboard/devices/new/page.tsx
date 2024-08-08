import DeviceForm from "@/components/Forms/DeviceForm";
import LoadingProgressBar from "@/components/LoadingProgressBar";
import { Metadata } from "next";

export default function Newdevice() {
  return <DeviceForm />;
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New Device - IoTDataHub - Dashboard",
  description:
    "Create a new device for your project or device data storage location and control options",
};
