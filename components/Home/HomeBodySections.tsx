import React from "react";

import HomeCard from "@/components/Home/containers/HomeCard";
import Featues from "@/components/Home/containers/Featues";
import Section7 from "@/components/Home/containers/Section7";
import Section8 from "@/components/Home/containers/Section8";
import Section9 from "@/components/Home/containers/Section9";
import Section10 from "@/components/Home/containers/Section10";

export default function HomeBodySections() {
  return (
    <div>
      {/* Body Sections */}
      <Featues />
      <HomeCard />
      <Section7 />
      <Section8 />
      <Section9 />
      <Section10 />
    </div>
  );
}
