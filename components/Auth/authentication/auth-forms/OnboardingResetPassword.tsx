"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  Box,
  Container,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
} from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

// Define types for API responses
interface EmailSubmitResponse {
  success: boolean;
  message: string;
}

interface OtpVerifyResponse {
  success: boolean;
  message: string;
}

interface PasswordResetResponse {
  success: boolean;
  message: string;
}

const OnboardingResetPassword: React.FC = () => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = ["Enter Email", "Verify OTP", "Set New Password"];

  const EmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/email/forgot-password",
        {
          userEmail: email,
        }
      );

      if (response.status !== 200) {
        setError(response.statusText);
      }
      setActiveStep(1);
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/email/otp-verification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ otp }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "OTP verification failed. Please try again.");
      }

      setActiveStep(2);
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const passwordFormik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(
          /[!@#$%^&*(),.?":{}|<>]/,
          "Password must contain at least one special character"
        )
        .matches(/\d/, "Password must contain at least one number")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values) => {
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/reset-password`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: email,
              password: values.password,
            }),
          }
        );
        const data: PasswordResetResponse = await response.json();
        if (!data.success) {
          setError(data.message);
        }

        router.push("/login");
      } catch (err) {
        setError("An error occurred. Please try again.");
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <form onSubmit={EmailSubmit}>
            <TextField
              fullWidth
              label="Email"
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Reset password
            </Button>
          </form>
        );
      case 1:
        return (
          <form onSubmit={handleOtpVerify}>
            <Typography variant="body1" gutterBottom>
              Enter the verification code sent to {email}
            </Typography>
            <MuiOtpInput
              value={otp}
              onChange={setOtp}
              length={6}
              validateChar={(char: string) => char.match(/[0-9]/) !== null}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Submit
            </Button>
            <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
              Didn't receive the code?{" "}
              <Button onClick={() => setActiveStep(0)}>Resend Code</Button>
            </Typography>
          </form>
        );
      case 2:
        return (
          <form onSubmit={passwordFormik.handleSubmit}>
            <FormControl
              fullWidth
              margin="normal"
              error={Boolean(
                passwordFormik.touched.password &&
                  passwordFormik.errors.password
              )}
            >
              <InputLabel htmlFor="password">New Password</InputLabel>
              <OutlinedInput
                id="password"
                type={showPassword ? "text" : "password"}
                value={passwordFormik.values.password}
                onChange={passwordFormik.handleChange}
                onBlur={passwordFormik.handleBlur}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="New Password"
              />
              {passwordFormik.touched.password &&
                passwordFormik.errors.password && (
                  <FormHelperText error>
                    {passwordFormik.errors.password}
                  </FormHelperText>
                )}
            </FormControl>
            <FormControl
              fullWidth
              margin="normal"
              error={Boolean(
                passwordFormik.touched.confirmPassword &&
                  passwordFormik.errors.confirmPassword
              )}
            >
              <InputLabel htmlFor="confirmPassword">
                Confirm New Password
              </InputLabel>
              <OutlinedInput
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={passwordFormik.values.confirmPassword}
                onChange={passwordFormik.handleChange}
                onBlur={passwordFormik.handleBlur}
                label="Confirm New Password"
              />
              {passwordFormik.touched.confirmPassword &&
                passwordFormik.errors.confirmPassword && (
                  <FormHelperText error>
                    {passwordFormik.errors.confirmPassword}
                  </FormHelperText>
                )}
            </FormControl>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Password should be:
              <ul>
                <li>A minimum of 8 characters</li>
                <li>Has a lower case (e.g: a)</li>
                <li>Has at least one upper case (e.g: A)</li>
                <li>Has at least one special character (e.g: @)</li>
                <li>Has at least 1 number (e.g: 2)</li>
              </ul>
            </Typography>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Submit new password
            </Button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ width: "100%", mt: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 4 }}>
          {renderStepContent(activeStep)}
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default OnboardingResetPassword;
