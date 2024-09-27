"use client";

import React, { useState } from "react";
import { Typography } from "@mui/material";
import { TypeAnimation } from "react-type-animation";

const HomeHeroSection = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        height: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          position: "absolute",
          top: "-5%",
          left: "-5%",
          right: "-5%",
          bottom: "-5%",
          backgroundImage: 'url("/IoT/hero.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: `blur(${isHovered ? "0px" : "10px"})`,
          transform: `scale(${isHovered ? 1.1 : 1})`,
          transition: "filter 0.3s ease-in-out, transform 0.3s ease-in-out",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{ color: "white", textAlign: "center", mb: 2 }}
        >
          IOT DATA HUB
        </Typography>
        <TypeAnimation
          sequence={[
            "Connecting devices",
            2000,
            "Analyzing data",
            2000,
            "Enabling smart decisions",
            2000,
          ]}
          wrapper="span"
          speed={50}
          style={{
            fontSize: "2em",
            display: "inline-block",
            color: "orange",
          }}
          repeat={Infinity}
        />
      </div>
    </div>
  );
};

export default HomeHeroSection;
