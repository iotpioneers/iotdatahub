import React from "react";

import { Metadata } from "next";
import FeaturedBody from "@/components/Home/Featured/FeaturedBody";

export default function Home() {
  return <FeaturedBody />;
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IoTDataHub - Featured Projects",
  description: "Explore our latest features",
};
