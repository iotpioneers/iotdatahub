import React from "react";
import { Metadata } from "next";
import TechSupport from "@/components/Home/components/tech-support";

const TechnicalSupportPage = () => {
  return <TechSupport />;
};

export default TechnicalSupportPage;

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IoTDataHub - Tech Support",
  description: "Get in touch with our tech support team",
};
