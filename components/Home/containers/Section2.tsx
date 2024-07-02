"use client";

import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import CountUp from "react-countup";
import Title from "../components/Title"; // Adjust the import path as per your file structure
import { section2Content } from "@/app/utils/content";

interface CounterProps {
  before?: string;
  after?: string;
  counter: number;
  subtitle: string;
  decimals?: number;
}

const CustomCounter: React.FC<CounterProps> = ({
  before = "",
  after = "",
  counter,
  subtitle,
  decimals,
}) => (
  <Stack spacing={{ xs: 1, md: 2 }} alignItems="center">
    <CountUp prefix={before} suffix={after} end={counter} decimals={decimals}>
      {({ countUpRef }) => (
        <Title variant="h2" sx={{ fontWeight: 400 }}>
          <span ref={countUpRef} />
        </Title>
      )}
    </CountUp>

    <Typography variant="body2" color="text.secondary">
      {subtitle}
    </Typography>
  </Stack>
);

const Section2 = () => {
  const { items } = section2Content;

  return (
    <Container sx={{ mt: -10 }}>
      <Box
        sx={{
          position: "relative",
          py: 5,
          bgcolor: "background.default",
          borderRadius: "50px",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            border: "2px solid transparent",
            borderRadius: "50px",
            background: "linear-gradient(180deg,grey,transparent) border-box",
            WebkitMask:
              "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exlude",
          },
        }}
      >
        <Grid container spacing={3} justifyContent="space-between">
          {items.map((item, index) => (
            <Grid item xs={6} md={3} key={index}>
              {/* Ensure decimals is always a number or undefined */}
              <CustomCounter
                counter={item.counter}
                subtitle={item.subtitle}
                before={item.before}
                after={item.after}
                decimals={
                  typeof item.decimals === "boolean" ? undefined : item.decimals
                }
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Section2;
