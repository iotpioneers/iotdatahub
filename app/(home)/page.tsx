import React from "react";

import { Metadata } from "next";
import HomeBody from "@/components/Home/HomeBody";

export default function Home() {
  return <HomeBody />;
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IoTDataCenter - Home",
  description: "Explore our latest features",
};
