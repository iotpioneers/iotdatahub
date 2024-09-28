import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Link,
  IconButton,
  useTheme,
} from "@mui/material";
import { Email, WhatsApp } from "@mui/icons-material";
import { socials } from "@/constants";
import Logo from "../Logo";

const Footer = () => {
  const theme = useTheme();

  const handleEmailClick = () => {
    window.location.href = "mailto:datahubiot";
  };

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/250791377302", "_blank");
  };

  return (
    <Box
      component="footer"
      sx={{
        py: 5,
        border: `15px outset #FFAB31`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and Company Info */}
          <Grid item xs={12} md={3}>
            <Logo />
            <Typography
              variant="body2"
              className="text-orange-50"
              sx={{ mt: 2 }}
            >
              IoTDataHub: Connecting devices, analyzing data, enabling smart
              decisions.
            </Typography>
          </Grid>

          {/* Navigation Links */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" className="text-orange-50" gutterBottom>
              Quick Links
            </Typography>
            <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
              {["Home", "About", "Services", "Contact"].map((item) => (
                <Box component="li" key={item} sx={{ mb: 1 }}>
                  <Link href="#" className="text-orange-50" underline="hover">
                    {item}
                  </Link>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Newsletter Subscription */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" className="text-orange-50" gutterBottom>
              Subscribe to Our Newsletter
            </Typography>
            <Box
              component="form"
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                variant="outlined"
                size="small"
                placeholder="Enter your email"
                sx={{ bgcolor: "grey.800", input: { color: "white" } }}
              />
              <Button variant="outlined" className="bg-orange-50 text-white">
                Subscribe
              </Button>
            </Box>
          </Grid>

          {/* Info Section */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" className="text-orange-50" gutterBottom>
              Contact Us
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1,
                cursor: "pointer",
              }}
              onClick={handleEmailClick}
            >
              <Email sx={{ mr: 1 }} className="text-orange-50" />
              <Typography variant="body2" className="text-orange-50">
                datahubiot@gmail.com
              </Typography>
            </Box>
            <Box
              sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
              onClick={handleWhatsAppClick}
            >
              <WhatsApp sx={{ mr: 1 }} className="text-orange-50" />
              <Typography variant="body2" className="text-orange-50">
                (+250) 791-377-302
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Social Links and Copyright */}
        <Box
          sx={{
            mt: 4,
            pt: 4,
            borderTop: 1,
            borderColor: "grey.800",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" className="text-orange-50">
            IoTDataHub © {new Date().getFullYear()}. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mt: { xs: 2, sm: 0 } }}>
            {socials.map((item) => (
              <IconButton
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-50"
              >
                <img
                  src={item.iconUrl}
                  width={16}
                  height={16}
                  alt={item.title}
                />
              </IconButton>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
