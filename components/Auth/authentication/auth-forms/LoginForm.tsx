"use client";

import React from "react";
import { FormikProps } from "formik";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Link from "next/link";
import AnimateButton from "../../AnimateButton";

interface FormValues {
  email: string;
  password: string;
}

interface LoginFormProps extends FormikProps<FormValues> {
  onGoogleSignIn: () => Promise<void>;
}

const LoginForm = ({
  errors,
  handleBlur,
  handleChange,
  handleSubmit,
  isSubmitting,
  onGoogleSignIn,
  touched,
  values,
}: LoginFormProps) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      <FormControl
        fullWidth
        error={Boolean(touched.email && errors.email)}
        sx={{ mb: 2 }}
      >
        <InputLabel htmlFor="email">Email Address</InputLabel>
        <OutlinedInput
          id="email"
          type="email"
          value={values.email}
          name="email"
          onBlur={handleBlur}
          onChange={handleChange}
        />
        {touched.email && errors.email && (
          <FormHelperText error>{errors.email}</FormHelperText>
        )}
      </FormControl>

      <FormControl
        fullWidth
        error={Boolean(touched.password && errors.password)}
        sx={{ mb: 2 }}
      >
        <InputLabel htmlFor="password">Password</InputLabel>
        <OutlinedInput
          id="password"
          type={showPassword ? "text" : "password"}
          value={values.password}
          name="password"
          onBlur={handleBlur}
          onChange={handleChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                size="large"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
        {touched.password && errors.password && (
          <FormHelperText error>{errors.password}</FormHelperText>
        )}
      </FormControl>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
      >
        <FormControlLabel
          control={<Checkbox name="rememberMe" color="primary" />}
          label="Remember me"
        />
        <Link href="/forgot-password">
          <Typography
            variant="subtitle1"
            color="secondary"
            sx={{ textDecoration: "none" }}
          >
            Forgot Password?
          </Typography>
        </Link>
      </Stack>

      <Box sx={{ mt: 2 }}>
        <AnimateButton>
          <Button
            disableElevation
            disabled={isSubmitting}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            color="secondary"
          >
            Sign In
          </Button>
        </AnimateButton>
      </Box>

      <Box sx={{ mt: 2 }}>
        <AnimateButton>
          <Button
            type="button"
            disableElevation
            fullWidth
            onClick={onGoogleSignIn}
            size="large"
            variant="outlined"
            sx={{
              color: "grey.700",
              backgroundColor: (theme) => theme.palette.grey[50],
              borderColor: (theme) => theme.palette.grey[100],
            }}
          >
            <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
              <img
                src="/socials/social-google.svg"
                alt="google"
                width={16}
                height={16}
              />
            </Box>
            Sign in with Google
          </Button>
        </AnimateButton>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" component="div" align="center">
          Don't have an account?{" "}
          <Link href="/register">
            <Typography variant="subtitle1" color="secondary" component="span">
              Sign Up
            </Typography>
          </Link>
        </Typography>
      </Box>
    </form>
  );
};

export default LoginForm;
