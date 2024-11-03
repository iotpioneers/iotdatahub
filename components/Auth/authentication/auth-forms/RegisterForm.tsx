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
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import Link from "next/link";
import AnimateButton from "../../AnimateButton";

interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  phonenumber: string;
}

const RegisterForm = ({
  errors,
  handleBlur,
  handleChange,
  handleSubmit,
  isSubmitting,
  touched,
  values,
}: FormikProps<FormValues>) => {
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
        error={Boolean(touched.name && errors.name)}
        sx={{ mb: 2 }}
      >
        <InputLabel htmlFor="name">Name</InputLabel>
        <OutlinedInput
          id="name"
          type="text"
          value={values.name}
          name="name"
          onBlur={handleBlur}
          onChange={handleChange}
        />
        {touched.name && errors.name && (
          <FormHelperText error>{errors.name}</FormHelperText>
        )}
      </FormControl>

      {/* Add similar form controls for email, password, confirmPassword, country, and phonenumber */}

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
            Sign Up
          </Button>
        </AnimateButton>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" component="div" align="center">
          Already have an account?{" "}
          <Link href="/login">
            <Typography variant="subtitle1" color="secondary" component="span">
              Sign In
            </Typography>
          </Link>
        </Typography>
      </Box>
    </form>
  );
};

export default RegisterForm;
