import React from "react";
import { Metadata } from "next";
import Checkout from "@/components/dashboard/Checkout/Checkout";

interface Props {
  params: { id: string };
}

export default function CheckoutPage({ params }: Props) {
  return <Checkout subscriptionId={params.id} />;
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Subscription Checkout - IoTDataHub - Dashboard",
  description:
    "Pricing checkout page of the IoTDataHub platform. Explore our latest pricing packages.",
};
