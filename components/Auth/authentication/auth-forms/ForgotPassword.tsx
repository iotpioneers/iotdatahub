"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

// material-ui
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

// third party
import * as Yup from "yup";
import axios from "axios";
import { Formik, FormikProps } from "formik";

// project imports
import MainCard from "@/components/dashboard/Header/cards/MainCard";
import LoadingProgressBar from "@/components/LoadingProgressBar";
import AnimateButton from "@/components/Auth/AnimateButton";

// ==============================|| FORGOT PASSWORD PAGE ||============================== //

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Must be a valid email")
    .max(255)
    .required("Email is required"),
});

type FormData = Yup.InferType<typeof schema>;

const ForgotPassword = ({ ...others }) => {
  const theme = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleCloseResult = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleSendResetPasswordEmail = async (data: FormData) => {
    setError(null);
    setLoading(true);
    const response = await axios.post(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/email/forgot-password",
      {
        userEmail: data.email,
      }
    );

    setLoading(false);
    if (response.status !== 200) {
      setError(response.statusText);
      setOpen(true);
    }
    setSuccess(
      `We have send an email to ${data.email}. Please visit you email account to reset your password.`
    );
    setOpen(true);
    setLoading(false);
    router.push("/login");
  };

  return (
    <section className="grid justify-center items-center mt-24 px-16 py-8">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        autoHideDuration={12000}
        onClose={handleCloseResult}
      >
        <Alert
          onClose={handleCloseResult}
          severity={error ? "error" : "success"}
          variant="standard"
          sx={{ width: "100%" }}
        >
          {error && error}
          {success && success}
        </Alert>
      </Snackbar>

      <MainCard
        title="Forgot Password"
        sx={{ boxShadow: "primary", border: "secondary", maxWidth: "500px" }}
      >
        <Typography variant="body2">
          Enter your email and we will send you a link to reset your password
        </Typography>
        <Formik
          initialValues={{
            email: "",
            submit: null,
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email("Must be a valid email")
              .max(255)
              .required("Email is required"),
          })}
          onSubmit={(values, actions) => {
            handleSendResetPasswordEmail(values);
            actions.setSubmitting(false);
          }}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values,
          }: FormikProps<{
            email: string;
            submit: null;
          }>) => (
            <form noValidate onSubmit={handleSubmit} {...others}>
              <FormControl
                fullWidth
                error={Boolean(touched.email && errors.email)}
                sx={{ ...theme.typography.customInput }}
              >
                <InputLabel htmlFor="outlined-adornment-email-login">
                  Email Address
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-email-login"
                  type="email"
                  value={values.email}
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  label="Email Address / Username"
                  inputProps={{}}
                />
                {touched.email && errors.email && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-email-login"
                  >
                    {errors.email}
                  </FormHelperText>
                )}
              </FormControl>

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
                    {loading ? "Sending ..." : "Reset Password"}
                  </Button>
                  {loading && <LoadingProgressBar />}
                </AnimateButton>
              </Box>
            </form>
          )}
        </Formik>
      </MainCard>
    </section>
  );
};

export default ForgotPassword;
