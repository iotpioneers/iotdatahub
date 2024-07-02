"use client";

import {
  Box,
  Button,
  Container,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import useMeasure from "react-use-measure";
import { heroSectionContent } from "@/app/utils/content";
import Title from "../components/Title";
import Image from "next/image";

const { title, subtitle, description } = heroSectionContent;
interface CustomButtonProps {
  children: React.ReactNode;
  [x: string]: any;
}

const CustomButton: React.FC<CustomButtonProps> = ({ children, ...props }) => (
  <Button
    variant="outlined"
    sx={{
      borderRadius: 4,
      color: "text.primary",
      borderColor: "text.primary",
      height: 58,
      px: 2,
    }}
    {...props}
  >
    {children}
  </Button>
);

const Hero = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [ref, { height }] = useMeasure();

  return (
    <Box sx={{ width: "100%", mb: "15rem" }}>
      {/* Main Background */}
      <Box sx={{ position: "fixed", zIndex: -10, top: 0, left: 0, right: 0 }}>
        <img
          src="home_assets/Backgrounds/main-bg-0_1.webp"
          style={{ width: "100%" }}
        />
      </Box>

      {/* backgrounds elements */}
      <Box
        ref={ref}
        sx={{
          position: "absolute",
          width: "100%",
          zIndex: -1,
          top: 0,
          left: 0,
          right: 0,
        }}
      >
        <img
          src="home_assets/Backgrounds/main-bg-0_1.webp"
          style={{ width: "100%", opacity: 0 }}
        />

        {/* Star */}
        <img
          src="home_assets/Backgrounds/main-bg-0-0.png"
          style={{
            position: "absolute",
            top: "30px",
            right: "15%",
            width: "500px",
          }}
        />

        {/* User */}

        <img
          src="/demo_dash_one.svg"
          style={{
            height: "100%",
            position: "absolute",
            right: 0,
            top: 10,
            backgroundSize: "cover",
          }}
        />

        <Box
          sx={{
            bgcolor: "background.default",
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "800px",
            top: `calc(${height}px - 13%)`,
          }}
        ></Box>
      </Box>

      {/* Content */}
      <Container
        sx={{
          height: "80vh",
          mt: 8,
          [theme.breakpoints.up("md")]: { mt: 6 },
        }}
      >
        <Stack sx={{ height: "100%" }} justifyContent="center" color="beige">
          <Title variant="h1" sx={{ letterSpacing: "0.02em", mb: 1, mt: 5 }}>
            {title}
          </Title>

          <Title
            variant="h2"
            sx={{
              fontWeight: 500,
              letterSpacing: "0.05em",
              mb: 5,
              width: "50%",
            }}
          >
            {subtitle}
          </Title>

          <Title
            variant="h5"
            sx={{
              fontWeight: 300,
              letterSpacing: "0.05em",
              mb: 5,
              width: "50%",
            }}
          >
            {description}
          </Title>

          {/*Rating Stars */}
          <div className="flex flex-wrap items-center gap-2">
            {Array(5)
              .fill(1)
              .map((_, index) => (
                <Image
                  src="/star.svg"
                  key={index}
                  alt="star"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              ))}
          </div>
        </Stack>
      </Container>
    </Box>
  );
};

export default Hero;
