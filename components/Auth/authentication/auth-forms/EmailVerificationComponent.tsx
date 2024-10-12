"use client";

import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { useRouter } from "next/navigation";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  FormHelperText,
} from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";
import useSWR from "swr";

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

const defaultTheme = createTheme();

const EmailVerificationComponent = () => {
  const [otp, setOtp] = React.useState("");
  const [activeStep, setActiveStep] = React.useState(1);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const fetcher = async (url: string, otp: string) => {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp }),
    });
    if (!response.ok) {
      const error = new Error(response.statusText);
      throw error;
    }
    return response.json();
  };

  const {
    data,
    error: swrError,
    isValidating,
    mutate,
  } = useSWR(
    otp.length === 6
      ? [`${process.env.NEXT_PUBLIC_BASE_URL}/api/email/otp-verification`, otp]
      : null,
    ([url, otp]) => fetcher(url, otp),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  React.useEffect(() => {
    if (data) {
      setActiveStep(2);
    }
    if (swrError) {
      setError(swrError.message || "An error occurred. Please try again.");
    }
  }, [data, swrError]);

  const handleOtpChange = (newValue: string) => {
    setOtp(newValue);
    setError(null);
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }
    mutate();
  };

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
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            <Step>
              <StepLabel>Enter OTP</StepLabel>
            </Step>
            <Step>
              <StepLabel>Verified</StepLabel>
            </Step>
          </Stepper>
          {activeStep === 1 && (
            <form onSubmit={handleOtpVerify}>
              <MuiOtpInput
                value={otp}
                onChange={handleOtpChange}
                length={6}
                validateChar={(char: string) => char.match(/[0-9]/) !== null}
                sx={{ mb: 2 }}
              />
              {error && (
                <FormHelperText error sx={{ mb: 2 }}>
                  {error}
                </FormHelperText>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isValidating}
                sx={{ mt: 2 }}
              >
                {isValidating ? "Verifying..." : "Verify OTP"}
              </Button>
            </form>
          )}
          {activeStep === 2 && (
            <>
              <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                Email verified successfully!
              </Typography>
              <Button
                fullWidth
                variant="contained"
                onClick={() => router.push("/feature-creation")}
                sx={{ mt: 2 }}
              >
                Continue
              </Button>
            </>
          )}
        </Container>
        <Box sx={{ mt: "auto", py: 3 }}>
          <Copyright />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default EmailVerificationComponent;
