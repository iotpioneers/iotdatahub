"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

// Material-UI imports
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
  useTheme,
} from "@mui/material";

// Third party
import * as Yup from "yup";
import { Formik } from "formik";

// Types
interface ContactFormData {
  firstName: string;
  lastName: string;
  workEmail: string;
  jobTitle: string;
  phoneNumber: string;
  expectedUsers: string;
  message: string;
}

const ContactSales = () => {
  const theme = useTheme();

  const initialValues: ContactFormData = {
    firstName: "",
    lastName: "",
    workEmail: "",
    jobTitle: "",
    phoneNumber: "",
    expectedUsers: "",
    message: "",
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    workEmail: Yup.string().email("Invalid email").required("Required"),
    jobTitle: Yup.string().required("Required"),
    phoneNumber: Yup.string().required("Required"),
    expectedUsers: Yup.string().required("Required"),
    message: Yup.string(),
  });

  const handleSubmit = async (
    values: ContactFormData,
    { setSubmitting }: any
  ) => {
    try {
      // Handle form submission
      await fetch("/api/contact-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      {/* Left side - Benefits */}
      <Grid item xs={12} md={6} sx={{ p: { xs: 3, md: 6 } }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "2.5rem", md: "3.5rem" },
            fontWeight: 700,
            mb: 6,
            lineHeight: 1.2,
          }}
        >
          Talk to our Sales team
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {[
            "Learn how your team can ramp up productivity with better collaboration.",
            "Watch IoT Data Hub in action with your own live demo, customized for your business.",
            "See what scaling without friction looks like when you use IoT Data Hub Enterprise to fit your exact needs.",
          ].map((benefit, index) => (
            <Box
              key={index}
              sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}
            >
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  bgcolor: "warning.light",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  mt: 0.5,
                }}
              >
                <Typography>✓</Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 400 }}>
                {benefit}
              </Typography>
            </Box>
          ))}
        </Box>
      </Grid>

      {/* Right side - Form */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          p: { xs: 3, md: 6 },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h4" sx={{ mb: 4 }}>
          Fill out this quick form and we'll get back to you shortly
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
          }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>First Name</InputLabel>
                  <OutlinedInput
                    name="firstName"
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="First Name"
                    error={touched.firstName && Boolean(errors.firstName)}
                    sx={{ bgcolor: "white" }}
                  />
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Last Name</InputLabel>
                  <OutlinedInput
                    name="lastName"
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Last Name"
                    error={touched.lastName && Boolean(errors.lastName)}
                    sx={{ bgcolor: "white" }}
                  />
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Work Email</InputLabel>
                  <OutlinedInput
                    name="workEmail"
                    value={values.workEmail}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Work Email"
                    error={touched.workEmail && Boolean(errors.workEmail)}
                    sx={{ bgcolor: "white" }}
                  />
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Job Title</InputLabel>
                  <OutlinedInput
                    name="jobTitle"
                    value={values.jobTitle}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Job Title"
                    error={touched.jobTitle && Boolean(errors.jobTitle)}
                    sx={{ bgcolor: "white" }}
                  />
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Phone Number</InputLabel>
                  <OutlinedInput
                    name="phoneNumber"
                    value={values.phoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Phone Number"
                    error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                    sx={{ bgcolor: "white" }}
                  />
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Expected Number of Users</InputLabel>
                  <Select
                    name="expectedUsers"
                    value={values.expectedUsers}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Expected Number of Users"
                    error={
                      touched.expectedUsers && Boolean(errors.expectedUsers)
                    }
                    sx={{ bgcolor: "white" }}
                  >
                    <MenuItem value="">Please Select...</MenuItem>
                    <MenuItem value="1-10">1-10</MenuItem>
                    <MenuItem value="11-50">11-50</MenuItem>
                    <MenuItem value="51-250">51-250</MenuItem>
                    <MenuItem value="251-500">251-500</MenuItem>
                    <MenuItem value="500+">500+</MenuItem>
                    <MenuItem value="not-sure">Not sure yet</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Message</InputLabel>
                  <OutlinedInput
                    name="message"
                    value={values.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Message"
                    multiline
                    rows={4}
                    placeholder="Your space to ask questions, tell us your goals, or anything else you need from us."
                    sx={{ bgcolor: "white" }}
                  />
                </FormControl>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                  sx={{
                    mt: 2,
                    height: 48,
                    bgcolor: "primary.main",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                  }}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
};

export default ContactSales;
