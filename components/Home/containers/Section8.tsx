"use client";

import { Box, Container, Stack, Typography } from "@mui/material";
import React from "react";
import Title from "../components/Title";
import { section8Content } from "@/app/utils/content";
import OutlinedButton from "../components/Buttons/OutlinedButton";

const { title, subtitle, caption, ShieldVideo } = section8Content;

const Section8 = () => {
  return (
    <Container
      maxWidth="md"
      sx={{ mt: { xs: 10, md: 20, lg: 25 }, textAlign: "center" }}
    >
      <Stack alignItems="center">
        <Title variant="h2" sx={{ mb: 2 }}>
          {title}
        </Title>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: { xs: 5, md: 8 } }}
        >
          {subtitle}
        </Typography>

        <Box sx={{ px: { xs: 2, md: 5, lg: 7 } }}>
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{ width: "100%", height: "100%" }}
          >
            <source src={ShieldVideo} type="video/mp4" />
          </video>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: { xs: 5, md: 8 }, mb: 3 }}
        >
          {caption}
        </Typography>

        <OutlinedButton fit arrow>
          Learn more
        </OutlinedButton>
      </Stack>
    </Container>
  );
};

export default Section8;
