"use client";

import { useRef } from "react";
import PopUpButton from "@/components/Home/components/design/PopUpButton/PopUpButton";
import Benefits from "./components/Benefits";
import Collaboration from "./components/Collaboration";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Services from "./components/Services";
import ButtonGradient from "@/components/Home/components/design/svg/ButtonGradient";

const HomeBody = () => {
  const sectionTop = useRef<HTMLElement>(null);

  const handleScroll = () => {
    sectionTop.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      <div>
        <PopUpButton handleScroll={handleScroll}></PopUpButton>
      </div>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Hero />
        <Benefits />
        <Collaboration />
        <Services />
        <Footer />
      </div>

      <ButtonGradient />
    </>
  );
};

export default HomeBody;
