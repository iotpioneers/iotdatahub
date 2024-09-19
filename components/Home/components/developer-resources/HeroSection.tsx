import React from "react";
import { Typography, Container, Button, Box } from "@mui/material";

// Hero section component
const HeroSection: React.FC = () => {
  return (
    <Box sx={{ bgcolor: "primary.main", color: "primary.contrastText", py: 8 }}>
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          IoTDataHub for Developers
        </Typography>
        <Typography variant="h5" component="p" gutterBottom>
          Everything you need to build amazing IoT projects
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          sx={{ mt: 2 }}
        >
          Get Started
        </Button>
      </Container>
    </Box>
  );
};

export default HeroSection;
