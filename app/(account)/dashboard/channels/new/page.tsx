import React from "react";
import { Metadata } from "next";
import ChannelSettingsForm from "@/components/Forms/ChannelSettingsForm";

export default function NewChannelPage() {
  return <ChannelSettingsForm />;
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New Channel - IoTDataHub - Dashboard",
  description:
    "Create a new channel for your project or device data storage location",
};
