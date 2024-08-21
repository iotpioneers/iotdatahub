import { Metadata } from "next";
import Checkout from "@/components/dashboard/SubscriptionCheckout/Checkout";

const Checout = () => {
  return <Checkout />;
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout - IoTDataHub - Dashboard",
  description:
    "The checkout page of the IoTDataHub platform. Explore our latest pricing packages.",
};
export default Checout;
