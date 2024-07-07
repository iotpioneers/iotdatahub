import React from "react";

import HomeBody from "@/components/Home/HomeBody";
import { Metadata } from "next";

export default function Home() {
  return (
    <div>
      <HomeBody />
    </div>
  );
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ten2Ten - Home",
  description: "Explore our latest features",
};
