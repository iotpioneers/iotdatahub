"use client";

import React from "react";
import {
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Box,
} from "@mui/material";

// Project imports
import HomeHeroSection from "./LandingPage/HomeHeroSection";
import ContactForm from "./components/tech-support/ContactForm";
import FAQ from "./LandingPage/FAQ";
import Footer from "./components/Footer";
import OurServices from "./LandingPage/OurServices";
import AnimatedMovingFeaturesComponent from "./LandingPage/AnimatedMovingFeaturesComponent";

// Hero Component
const Hero: React.FC = () => (
  <Box sx={{ bgcolor: "primary.orange", color: "primary.contrastText", py: 8 }}>
    <HomeHeroSection />
  </Box>
);

// RecentBlogs Component
const RecentBlogs: React.FC = () => (
  <Container sx={{ py: 8 }}>
    <Typography
      variant="h4"
      component="h2"
      gutterBottom
      className="text-orange-50"
    >
      Recent Blogs
    </Typography>
    <Grid container spacing={4}>
      {[
        "IoT in Retail Industry- Top 8 Benefits and Use Cases",
        "Tracking Devices for Older People: Features & Benefits",
        "Equipment Tracking & Monitoring System: A Complete Guide",
      ].map((blog) => (
        <Grid item xs={12} sm={4} key={blog}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                {blog}
              </Typography>
              <Button>Read Full Blog</Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Container>
);

// HomePage Component
const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <OurServices />
      <AnimatedMovingFeaturesComponent />
      <ContactForm />
      <FAQ />
      <RecentBlogs />
      <Footer />
    </>
  );
};

export default HomePage;
