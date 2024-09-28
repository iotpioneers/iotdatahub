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
import PopUpButton from "@/components/Home/components/design/PopUpButton/PopUpButton";
import Benefits from "./LandingPage/Benefits";
import Link from "next/link";

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
              <Link href="/blog">
                <Typography variant="h6" component="h3" gutterBottom>
                  {blog}
                </Typography>
              </Link>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Container>
);

// HomePage Component
const HomePage: React.FC = () => {
  const sectionTop = React.useRef<HTMLElement>(null);

  const handleScroll = () => {
    sectionTop.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Hero />
      <div>
        <PopUpButton handleScroll={handleScroll}></PopUpButton>
      </div>
      <Box sx={{ bgcolor: "background.default" }}>
        <OurServices />
        <AnimatedMovingFeaturesComponent />
        <Benefits />
        <ContactForm />
        <FAQ />
        <RecentBlogs />
        <Footer />
      </Box>
    </>
  );
};

export default HomePage;

/*
"use client";
import * as React from "react";

// MUI imports
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

// Project imports
import Hero from "./LandingPage/Hero";
import Highlights from "./LandingPage/Highlights";
import Features from "./LandingPage/Features";
import Testimonials from "./LandingPage/Testimonials";
import FAQ from "./LandingPage/FAQ";
import Benefits from "./LandingPage/Benefits";
import PopUpButton from "@/components/Home/components/design/PopUpButton/PopUpButton";
import ButtonGradient from "@/components/Home/components/design/svg/ButtonGradient";
import Footer from "./components/Footer";

const HomeBody = () => {
  const sectionTop = React.useRef<HTMLElement>(null);

  const handleScroll = () => {
    sectionTop.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Hero />

      <div>
        <PopUpButton handleScroll={handleScroll}></PopUpButton>
      </div>
      <Box sx={{ bgcolor: "background.default" }}>
        <Benefits />
        <Divider />
        <Features />
        <Divider />
        <Testimonials />
        <Divider />
        <Highlights />
        <Divider />
        <FAQ />
        <Footer />
      </Box>
      <ButtonGradient />
    </>
  );
};
export default HomeBody;

*/
