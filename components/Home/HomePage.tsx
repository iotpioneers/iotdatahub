"use client";

import React from "react";
import {
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";
import HeroSection from "./LandingPage/LandingPage";
import ContactForm from "./components/tech-support/ContactForm";
import FAQ from "./LandingPage/FAQ";
import Footer from "./components/Footer";

// Hero Component
const Hero: React.FC = () => (
  <Box sx={{ bgcolor: "primary.orange", color: "primary.contrastText", py: 8 }}>
    <HeroSection />
  </Box>
);

// Services Component
const Services: React.FC = () => (
  <Container sx={{ py: 8 }}>
    <Typography variant="h4" component="h2" gutterBottom>
      IoT Dashboard Development Services
    </Typography>
    <Grid container spacing={4}>
      {[
        "Custom Dashboard Development",
        "IoT Device Integration",
        "Dashboard UI/UX Design",
        "Maintenance",
      ].map((service) => (
        <Grid item xs={12} sm={6} md={3} key={service}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                {service}
              </Typography>
              <Typography variant="body2">
                Description of {service}...
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Container>
);

// Process Component
const Process: React.FC = () => (
  <Container sx={{ py: 8 }}>
    <Typography variant="h4" component="h2" gutterBottom>
      Our Process
    </Typography>
    <Grid container spacing={4}>
      {[
        "Requirement Gathering & Analysis",
        "UI/UX Designing",
        "Development",
        "Testing",
      ].map((step, index) => (
        <Grid item xs={12} sm={6} md={3} key={step}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                {index + 1}. {step}
              </Typography>
              <Typography variant="body2">Description of {step}...</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Container>
);

// Features Component
const Features: React.FC = () => (
  <Container sx={{ py: 8 }}>
    <Typography variant="h4" component="h2" gutterBottom>
      IoT Dashboards Features
    </Typography>
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Typography variant="h6" component="h3" gutterBottom>
          Lower Latency Rates And Quicker Data Offloading Time
        </Typography>
        <Typography variant="body1">
          We design IoT monitoring dashboards by implementing edge computing on
          IoT devices...
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="h6" component="h3" gutterBottom>
          Intuitive IoT Monitoring Dashboards
        </Typography>
        <Typography variant="body1">
          Our custom IoT monitoring dashboard will give you a more impactful
          experience...
        </Typography>
      </Grid>
    </Grid>
  </Container>
);

// WhyChooseUs Component
const WhyChooseUs: React.FC = () => (
  <Container sx={{ py: 8 }}>
    <Typography variant="h4" component="h2" gutterBottom>
      Why Choose PsiBorg?
    </Typography>
    <Grid container spacing={4}>
      {["Expertise", "Innovation", "Reliability"].map((reason) => (
        <Grid item xs={12} sm={4} key={reason}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                {reason}
              </Typography>
              <Typography variant="body2">
                Description of why to choose PsiBorg for {reason}...
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Container>
);

// CaseStudies Component
const CaseStudies: React.FC = () => (
  <Container sx={{ py: 8 }}>
    <Typography variant="h4" component="h2" gutterBottom>
      Case Studies
    </Typography>
    <Grid container spacing={4}>
      {[
        "LMS Software for Schools",
        "Maximizing Child Safety",
        "Real-Time Remote Patient Monitoring",
      ].map((study) => (
        <Grid item xs={12} sm={4} key={study}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                {study}
              </Typography>
              <Typography variant="body2">
                Brief description of the case study...
              </Typography>
              <Button>Read Full Story</Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Container>
);

// RecentBlogs Component
const RecentBlogs: React.FC = () => (
  <Container sx={{ py: 8 }}>
    <Typography variant="h4" component="h2" gutterBottom>
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
              <Typography variant="body2">
                Brief description of the blog post...
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
      <Services />
      <Process />
      <Features />
      <WhyChooseUs />
      <CaseStudies />
      <ContactForm />
      <FAQ />
      <RecentBlogs />
      <Footer />
    </>
  );
};

export default HomePage;
