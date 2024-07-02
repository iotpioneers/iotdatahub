"use client";

import React from "react";
import { Container, Grid } from "@mui/material";
import ServiceCard from "../components/Cards/ServiceCard";
import Title from "../components/Title";
import { section6Content } from "@/app/utils/content";

const { title, ITEMS } = section6Content;

const Section6 = () => {
  return (
    <Container sx={{ mt: { xs: 10, md: 20, lg: 25 } }}>
      <Title variant="h2" sx={{ mb: 8 }}>
        {title}
      </Title>

      <Grid container spacing={3}>
        {ITEMS.map((item) => (
          <Grid item xs={12} md={6} key={item.title}>
            <ServiceCard {...item} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Section6;
