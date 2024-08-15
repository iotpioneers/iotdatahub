"use client";
import * as React from "react";

// MUI imports
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

// Project imports
import Hero from "./LandingPage/Hero";
import Highlights from "./LandingPage/Highlights";
import Features from "./LandingPage/Features";
import Testimonials from "./LandingPage/Testimonials";
import FAQ from "./LandingPage/FAQ";
import Benefits from "./LandingPage/Benefits";
import Collaboration from "./LandingPage/Collaboration";
import PopUpButton from "@/components/Home/components/design/PopUpButton/PopUpButton";
import ButtonGradient from "@/components/Home/components/design/svg/ButtonGradient";

const HomeBody = () => {
  const sectionTop = React.useRef<HTMLElement>(null);

  const handleScroll = () => {
    sectionTop.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Hero />

      <div>
        <PopUpButton handleScroll={handleScroll}></PopUpButton>
      </div>
      <Box sx={{ bgcolor: "background.default" }}>
        <Benefits />
        <Divider />
        <Features />
        <Divider />
        <Testimonials />
        <Divider />
        <Collaboration />
        <Divider />
        <Highlights />
        <Divider />
        <FAQ />
      </Box>
      <ButtonGradient />
    </>
  );
};
export default HomeBody;
