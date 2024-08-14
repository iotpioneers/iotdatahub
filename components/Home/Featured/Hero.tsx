import * as React from "react";
import Image from "next/image";
import { alpha } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import styled from "styled-components";
import hover3d from "@/app/utils/hover";
import Section from "../components/Section";

const Hero = () => {
  const hero = React.useRef<HTMLDivElement>(null);

  const hoverHero = hover3d(hero, {
    ref: hero,
    x: 30,
    y: -40,
    z: 30,
  });

  const imageHover = hover3d(hero, {
    ref: hero,
    x: 20,
    y: -5,
    z: 11,
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
          })}
        >
          <Container
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              pt: { xs: 14, sm: 20 },
              pb: { xs: 8, sm: 12 },
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
                    IoT Data Hub
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
              <Typography
                variant="caption"
                textAlign="center"
                sx={{ opacity: 0.8 }}
              >
                By clicking &quot;Get Started&quot; you agree to our&nbsp;
                <Link href="#" color="primary">
                  Terms & Conditions
                </Link>
                .
              </Typography>
            </Stack>
            <div
              className="image-content image"
              style={{
                transform: hoverHero.transform,
              }}
            >
              <Image
                src="/hero/home.jpg"
                width={600}
                height={600}
                alt="hero"
                style={{
                  transform: imageHover.transform,
                }}
              />
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
