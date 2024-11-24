import React from "react";

import { Metadata } from "next";
import HomePage from "@/components/Home/HomePage";

export default function Home() {
  return <HomePage />;
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IoTDataHub - Home",
  description: "Explore our latest features",
};
