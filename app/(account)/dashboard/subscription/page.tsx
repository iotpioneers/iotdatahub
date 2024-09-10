import React from "react";
import UpgradePricingPlan from "@/components/dashboard/account/subscription/UpgradePricingPlan";
import { Metadata } from "next";

export default function PricingList() {
  return <UpgradePricingPlan />;
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pricing - IoTDataHub - Dashboard",
  description:
    "The pricing page of the IoTDataHub platform. Explore our latest pricing packages.",
};
