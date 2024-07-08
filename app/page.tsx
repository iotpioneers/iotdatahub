import React from "react";

import HomeBody from "@/components/Home/HomeBody";
import { Metadata } from "next";
import Header from "@/components/Home/components/Header";

export default function Home() {
  return (
    <div>
      <Header />
      <HomeBody />
    </div>
  );
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ten2Ten - Home",
  description: "Explore our latest features",
};
