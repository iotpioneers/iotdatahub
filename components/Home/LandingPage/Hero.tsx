import * as React from "react";

import { alpha } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import styled from "styled-components";
import hover3d from "@/app/utils/hover";
import Section from "../components/Section";
import SwipeableTextMobileStepper from "../components/design/HorizontalStepper/SwipeableTextMobileStepper";

const Hero = () => {
  const hero = React.useRef<HTMLDivElement>(null);

  const hoverHero = hover3d(hero, {
    ref: hero,
    x: 30,
    y: -40,
    z: 30,
  });

  return (
    <HeroStyled ref={hero}>
      <Section>
        <Box
          id="hero"
          sx={(theme) => ({
            width: "100%",
            backgroundImage:
              theme.palette.mode === "light"
                ? "linear-gradient(180deg, #CEE5FD, #FFF)"
                : `linear-gradient(#02294F, ${alpha("#090E10", 0.0)})`,
            backgroundSize: "100% 20%",
            backgroundRepeat: "no-repeat",
            mt: { sm: "-4rem", md: "-5rem" },
          })}
        >
          <Container
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              pt: { xs: 10, sm: 14 },
              pb: { xs: 1, sm: 2 },
            }}
          >
            <Stack
              spacing={2}
              useFlexGap
              sx={{ width: { xs: "100%", sm: "70%" } }}
            >
              <Typography
                variant="h1"
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignSelf: "center",
                  textAlign: "center",
                  fontSize: "clamp(3.5rem, 10vw, 4rem)",
                }}
              >
                Cutt edge with&nbsp;
                <span className="inline-block relative mx-1">
                  <Typography
                    component="span"
                    variant="h1"
                    sx={{
                      fontSize: "clamp(3rem, 10vw, 4rem)",
                      color: (theme) =>
                        theme.palette.mode === "light"
                          ? "primary.main"
                          : "primary.light",
                    }}
                  >
                    IoTDataHub
                    <img
                      src="hero/curve.png"
                      className="absolute top-full left-0 w-full xl:-mt-2"
                      width={624}
                      height={28}
                      alt="Curve"
                    />
                  </Typography>
                  <img
                    src="hero/curve.png"
                    className="absolute top-full left-0 w-full xl:-mt-2"
                    width={624}
                    height={28}
                    alt="Curve"
                  />
                </span>
              </Typography>
              <Typography
                textAlign="center"
                color="text.secondary"
                sx={{ alignSelf: "center", width: { sm: "100%", md: "80%" } }}
              >
                Connect, manage, and analyze your IoT devices with our powerful
                platform. Access real-time data, gain insights, and optimize
                your operations effortlessly.
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignSelf="center"
                spacing={1}
                useFlexGap
                sx={{ pt: 2, width: { xs: "100%", sm: "auto" } }}
              >
                <Button variant="contained" color="primary">
                  Get Started
                </Button>
              </Stack>
            </Stack>
            <div
              className="image-content image mt-5 2xl:mt-0"
              style={{
                transform: hoverHero.transform,
              }}
            >
              <div className="rounded-2xl bg-conic-gradient p-1">
                <SwipeableTextMobileStepper />
              </div>
            </div>
          </Container>
        </Box>
      </Section>
    </HeroStyled>
  );
};

const HeroStyled = styled.header`
    .image-content .image {
      padding: 1rem;
      border-radius: 8px;
      background-color: var(--color-bg);
      border: 1px solid var(--color-border);
    }
  }
`;

export default Hero;
