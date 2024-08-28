import React from "react";
import { Typography } from "@mui/material";
import { TypeAnimation } from "react-type-animation";

const HeroSection = () => {
  return (
    <div>
      <div
        style={{
          backgroundImage: 'url("/IoT/s-tsuchiya-sPLLVFJXlb8-unsplash.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "400px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
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
          style={{ fontSize: "2em", display: "inline-block", color: "red" }}
          repeat={Infinity}
        />
      </div>
    </div>
  );
};

export default HeroSection;
