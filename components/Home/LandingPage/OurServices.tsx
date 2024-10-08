"use client";

import * as React from "react";
import styled from "styled-components";
import { motion, useScroll, useTransform } from "framer-motion";

// Material UI
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import ThumbUpAltRoundedIcon from "@mui/icons-material/ThumbUpAltRounded";

const items = [
  {
    icon: <SettingsSuggestRoundedIcon />,
    title: "Scalable IoT Solutions",
    description:
      "Our platform adapts seamlessly to growing demands, offering scalable solutions that ensure efficient data management and control.",
  },
  {
    icon: <ConstructionRoundedIcon />,
    title: "Robust Infrastructure",
    description:
      "Built with durability in mind, our system ensures consistent and reliable performance, even in challenging environments.",
  },
  {
    icon: <ThumbUpAltRoundedIcon />,
    title: "Intuitive User Interface",
    description:
      "Designed for ease of use, our platform offers an intuitive interface, making complex tasks simple and accessible.",
  },
  {
    icon: <AutoFixHighRoundedIcon />,
    title: "Advanced Data Analytics",
    description:
      "Leverage cutting-edge analytics tools to gain deep insights, enabling smarter decisions and optimized outcomes.",
  },
  {
    icon: <SupportAgentRoundedIcon />,
    title: "24/7 Customer Support",
    description:
      "Our dedicated support team is available around the clock, providing expert assistance whenever you need it.",
  },
  {
    icon: <QueryStatsRoundedIcon />,
    title: "Precision Agriculture",
    description:
      "Our platform offers precision tools that enhance agricultural productivity, ensuring accurate monitoring and control.",
  },
];

const HighlightWrapper = ({ children }: { children: React.ReactNode }) => {
  const div = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: div,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [1, 0.4, 0], [0, 0, -1000]);

  return (
    <div ref={div}>
      <motion.div style={{ x }}>{children}</motion.div>
    </div>
  );
};

const OurServices = () => {
  const theme = useTheme();

  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        background: theme.palette.background.paperChannel,
      }}
    >
      <Container
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: "100%", md: "60%" },
            textAlign: { sm: "left", md: "center" },
          }}
        >
          <Typography component="h2" variant="h4">
            Our Services
          </Typography>
          <Typography variant="body1" sx={{ color: "grey.400" }}>
            Discover what makes our platform exceptional: scalability,
            robustness, user-friendliness, advanced analytics, precision tools,
            and unmatched support.
          </Typography>
        </Box>
        <HighlightSectionStyled>
          <Grid container spacing={2.5}>
            {items.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <HighlightWrapper>
                  <Stack
                    direction="column"
                    color="inherit"
                    component={Card}
                    spacing={1}
                    useFlexGap
                    sx={{
                      p: 3,
                      height: "100%",
                      border: "1px solid",
                      borderColor: "grey.800",
                      background: "transparent",
                    }}
                  >
                    <Box sx={{ opacity: "50%" }}>{item.icon}</Box>
                    <div className="grid">
                      <Typography fontWeight="medium" gutterBottom>
                        {item.title}
                      </Typography>
                      <Typography variant="body2">
                        {item.description}
                      </Typography>
                    </div>
                  </Stack>
                </HighlightWrapper>
              </Grid>
            ))}
          </Grid>
        </HighlightSectionStyled>
      </Container>
    </Box>
  );
};

const HighlightSectionStyled = styled.section`
  width: 100%;
`;

export default OurServices;
