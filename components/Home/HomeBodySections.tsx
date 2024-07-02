import React from "react";

import Section4 from "@/components/Home/containers/Section4";
import Section5 from "@/components/Home/containers/Section5";
import Section6 from "@/components/Home/containers/Section6";
import Section7 from "@/components/Home/containers/Section7";
import Section8 from "@/components/Home/containers/Section8";
import Section9 from "@/components/Home/containers/Section9";
import Section10 from "@/components/Home/containers/Section10";
import Features from "./Features";

export default function HomeBodySections() {
  return (
    <div>
      {/* Body Sections */}
      <Features />
      <Section4 />
      <Section5 />
      <Section6 />
      <Section7 />
      <Section8 />
      <Section9 />
      <Section10 />
    </div>
  );
}
