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
  Alert,
  Snackbar,
} from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";
import useSWR from "swr";

const defaultTheme = createTheme();

const EmailVerificationComponent = () => {
  const [otp, setOtp] = React.useState("");
  const [activeStep, setActiveStep] = React.useState(1);
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null,
  );
  const [isResending, setIsResending] = React.useState(false);

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
    },
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

  const handleResendEmail = async () => {
    setIsResending(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Get user email and full name from localStorage
      const userEmail = localStorage.getItem("userEmail");
      const userFullName = localStorage.getItem("userFullName");

      if (!userEmail) {
        throw new Error("Email not found. Please try logging in again.");
      }

      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userFullName, userEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend verification email");
      }

      setSuccessMessage("Verification email has been resent successfully!");
      setOtp("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend email");
    } finally {
      setIsResending(false);
    }
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
            variant="h2"
            component="h1"
            gutterBottom
            align="center"
            sx={{ mb: 4, fontWeight: 700 }}
          >
            Confirm Your Email Now
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
            <>
              <Typography variant="body2" align="center" sx={{ mb: 2 }}>
                Check your inbox for an email from <b>IoT DATA HUB</b>. Please
                confirm your identity by providing the code sent to your email
              </Typography>
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
                <Typography
                  variant="body2"
                  align="center"
                  sx={{ mt: 2 }}
                  color="textSecondary"
                >
                  Search SPAM folder for an email from <b>IoT DATA HUB</b>. Also
                  add it to your address book.{" "}
                </Typography>
                <Typography
                  variant="body2"
                  align="center"
                  sx={{ mt: 2 }}
                  color="textSecondary"
                >
                  It may take a minute to receive verification message. Haven't
                  received it yet?{" "}
                  <Link
                    component="button"
                    variant="body2"
                    onClick={handleResendEmail}
                    disabled={isResending}
                    sx={{
                      textDecoration: "none",
                      "&:hover": { textDecoration: "underline" },
                      cursor: "pointer",
                    }}
                  >
                    {isResending ? "Resending..." : "Resend"}
                  </Link>
                </Typography>
              </form>
            </>
          )}
          {activeStep === 2 && (
            <>
              <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                Email verified successfully!
              </Typography>
              <Button
                fullWidth
                variant="contained"
                onClick={() => router.push("/login")}
                sx={{ mt: 2 }}
              >
                Continue Continue
              </Button>
            </>
          )}
        </Container>
      </Box>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSuccessMessage(null)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSuccessMessage(null)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default EmailVerificationComponent;
