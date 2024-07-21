import React from "react";
import Pricing from "@/components/Home/components/Pricing";
import { Metadata } from "next";

const PricingPage = () => {
  return <Pricing />;
};

export default PricingPage;

export const metadata: Metadata = {
  title: "ARTISAN - Pricing",
  description: "Explore our latest pricing",
};
