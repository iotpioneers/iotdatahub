"use client";

import React from "react";
import { Box } from "@mui/material";

// Project imports
import HomeHeroSection from "./LandingPage/HomeHeroSection";
import FAQ from "./LandingPage/FAQ";
import Footer from "./components/Footer";
import OurServices from "./LandingPage/OurServices";
import AnimatedMovingFeaturesComponent from "./LandingPage/HomeAnimatedMovingFeaturesComponent";
import AnimatedMovingFeaturesComponent from "./LandingPage/HomeAnimatedMovingFeaturesComponent";
import PopUpButton from "@/components/Home/components/design/PopUpButton/PopUpButton";

// Hero Component
const Hero: React.FC = () => (
  <Box sx={{ bgcolor: "primary.orange", color: "primary.contrastText", py: 8 }}>
    <HomeHeroSection />
  </Box>
);

// HomePage Component
const HomePage: React.FC = () => {
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
        <OurServices />
        <AnimatedMovingFeaturesComponent />
        <FAQ />
        <Footer />
      </Box>
    </>
  );
};

export default HomePage;
