"use client";

import React from "react";
import { Box, Divider } from "@mui/material";
import ConnectionMethods from "./ConnectionMethods";
import HelpfulResources from "./HelpfulResources";
import HeroSection from "./HeroSection";
import LearnBasics from "./LearnBasics";
import TechnicalRequirements from "./TechnicalRequirements";

// Main DeveloperResources component
const DeveloperResources: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <HeroSection />
      <ConnectionMethods />
      <Divider />
      <TechnicalRequirements />
      <Divider />
      <LearnBasics />
      <Divider />
      <Divider />
      <HelpfulResources />
    </Box>
  );
};

export default DeveloperResources;
