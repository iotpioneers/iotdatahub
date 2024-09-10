"use client";

import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="/" sx={{ marginRight: 1 }}>
        IoT Data Hub
      </Link>
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// Default MUI theme
const defaultTheme = createTheme();

const EmailVerificationMessage = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Container component="main" sx={{ mt: 16 }} maxWidth="sm">
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            align="center"
            sx={{ mb: 4 }}
          >
            Verify Your Email
          </Typography>
          <Typography
            variant="h6"
            component="h4"
            gutterBottom
            align="center"
            sx={{ mb: 4 }}
          >
            Thank you for registering with IoT Data Hub! To complete your
            registration, please check your email and click on the verification
            link.
          </Typography>
          <Typography variant="body1" align="center">
            If you did not receive the email, check your spam folder or
            <Link href="/login" aria-label="sign in" sx={{ marginX: 1 }}>
              sign in
            </Link>
            if you've verified your email.
          </Typography>
        </Container>
        <Box sx={{ mt: "auto", py: 3 }}>
          <Copyright />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default EmailVerificationMessage;
