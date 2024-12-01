"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { Formik } from "formik";
import {
  Stack,
  Typography,
  Box,
  Grid,
  Button,
  Divider,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import AnimateButton from "../AnimateButton";
import CountryList from "../authentication/auth-forms/CountryList";

interface CountryType {
  code: string;
  label: string;
  phone: string;
  suggested?: boolean;
}

// interface for form data
interface EnterpriseData {
  organizationName: string;
  industry: string;
  employeeCount: string;
  contactName: string;
  jobTitle: string;
  email: string;
  phone: string;
  country: string;
  deviceCount: string;
}

// schema for form validation
const schema = Yup.object().shape({
  organizationName: Yup.string()
    .max(255, "Organization name must be at most 255 characters")
    .required("Organization Name is required"),
  industry: Yup.string()
    .oneOf(
      ["manufacturing", "healthcare", "agriculture", "energy"],
      "Invalid industry",
    )
    .required("Industry is required"),
  employeeCount: Yup.string()
    .oneOf(["<10", "10-50", "50-100", ">100"], "Invalid employee count")
    .required("Number of employees is required"),
  contactName: Yup.string()
    .max(255, "Full name must be at most 255 characters")
    .required("Full Name is required"),
  jobTitle: Yup.string()
    .max(255, "Job title must be at most 255 characters")
    .required("Job title is required"),
  email: Yup.string()
    .email("Must be a valid email")
    .max(255, "Email must be at most 255 characters")
    .required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  country: Yup.string().required("Country is required"),
  deviceCount: Yup.string().required("Device count is required"),
});

const AuthEnterpriseRegister: React.FC = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryType | null>(
    null,
  );
  const router = useRouter();

  const postEnterprise = async (
    url: string,
    enterpriseData: EnterpriseData,
  ) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(enterpriseData),
    });

    console.log("response", response);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create enterprise account");
    }

    return response.json();
  };

  const { mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/enterprise`,
    (url) => null,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    },
  );

  const steps = [
    "Organization Details",
    "Contact Information",
    "Technical Requirements",
  ];

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleCloseResult = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const submitEnterprise = async (data: EnterpriseData) => {
    const phoneNumber = selectedCountry?.phone
      ? `+${selectedCountry.phone} ${data.phone}`
      : data.phone;

    setIsSubmitting(true);
    try {
      await mutate(() =>
        postEnterprise(`${process.env.NEXT_PUBLIC_BASE_URL}/api/enterprise`, {
          ...data,
          phone: phoneNumber,
          country: selectedCountry?.label || "",
        }),
      );
      router.push("/organization/dashboard");
    } catch (error) {
      console.error(
        error instanceof Error
          ? error.message
          : "Failed to create enterprise account",
      );
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create enterprise account",
      );
      setOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        autoHideDuration={12000}
        onClose={handleCloseResult}
      >
        <Alert
          onClose={handleCloseResult}
          severity="error"
          variant="standard"
          sx={{ width: "100%" }}
        >
          {error && error}
        </Alert>
      </Snackbar>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Formik
        initialValues={{
          organizationName: "",
          industry: "",
          employeeCount: "",
          contactName: "",
          jobTitle: "",
          email: "",
          phone: "",
          country: "",
          deviceCount: "",
        }}
        validationSchema={schema}
        onSubmit={(values, actions) => {
          submitEnterprise(values);
          actions.setSubmitting(false);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <form noValidate onSubmit={handleSubmit}>
            {activeStep === 0 && (
              <Grid container spacing={matchDownSM ? 0 : 2}>
                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    error={Boolean(
                      touched.organizationName && errors.organizationName,
                    )}
                    sx={{ ...theme.typography.customInput }}
                  >
                    <InputLabel htmlFor="outlined-adornment-organization-name">
                      Organization Name
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-organization-name"
                      type="text"
                      value={values.organizationName}
                      name="organizationName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Organization Name"
                      inputProps={{}}
                    />
                    {touched.organizationName && errors.organizationName && (
                      <FormHelperText error>
                        {errors.organizationName}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    error={Boolean(touched.industry && errors.industry)}
                    sx={{ ...theme.typography.customInput }}
                  >
                    <InputLabel>Industry</InputLabel>
                    <Select
                      value={values.industry}
                      label="Industry"
                      name="industry"
                      onBlur={handleBlur}
                      onChange={handleChange}
                    >
                      <MenuItem value="manufacturing">Manufacturing</MenuItem>
                      <MenuItem value="healthcare">Healthcare</MenuItem>
                      <MenuItem value="agriculture">Agriculture</MenuItem>
                      <MenuItem value="energy">Energy</MenuItem>
                    </Select>
                    {touched.industry && errors.industry && (
                      <FormHelperText error>{errors.industry}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    error={Boolean(
                      touched.employeeCount && errors.employeeCount,
                    )}
                    sx={{ ...theme.typography.customInput }}
                  >
                    <InputLabel>Number of Employees</InputLabel>
                    <Select
                      value={values.employeeCount}
                      label="Number of Employees"
                      name="employeeCount"
                      onBlur={handleBlur}
                      onChange={handleChange}
                    >
                      <MenuItem value="<10">Less than 10 employees</MenuItem>
                      <MenuItem value="10-50">10 - 50 employees</MenuItem>
                      <MenuItem value="50-100">50 - 100 employees</MenuItem>
                      <MenuItem value=">100">More than 100 employees</MenuItem>
                    </Select>
                    {touched.employeeCount && errors.employeeCount && (
                      <FormHelperText error>
                        {errors.employeeCount}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            )}

            {activeStep === 1 && (
              <Grid container spacing={matchDownSM ? 0 : 2}>
                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    error={Boolean(touched.contactName && errors.contactName)}
                    sx={{ ...theme.typography.customInput }}
                  >
                    <InputLabel htmlFor="outlined-adornment-contact-name">
                      Full Name
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-contact-name"
                      type="text"
                      value={values.contactName}
                      name="contactName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Contact Name"
                      inputProps={{}}
                    />
                    {touched.contactName && errors.contactName && (
                      <FormHelperText error>
                        {errors.contactName}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    error={Boolean(touched.jobTitle && errors.jobTitle)}
                    sx={{ ...theme.typography.customInput }}
                  >
                    <InputLabel htmlFor="outlined-adornment-job-title">
                      Job Title
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-job-title"
                      type="text"
                      value={values.jobTitle}
                      name="jobTitle"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Job Title"
                      inputProps={{}}
                    />
                    {touched.jobTitle && errors.jobTitle && (
                      <FormHelperText error>{errors.jobTitle}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                    sx={{ ...theme.typography.customInput }}
                  >
                    <InputLabel htmlFor="outlined-adornment-email">
                      Email Address
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-email"
                      type="email"
                      value={values.email}
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Email Address"
                      inputProps={{}}
                    />
                    {touched.email && errors.email && (
                      <FormHelperText error>{errors.email}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    error={Boolean(touched.country && errors.country)}
                    sx={{ ...theme.typography.customInput }}
                  >
                    <CountryList
                      selectedCountry={selectedCountry}
                      setSelectedCountry={(country) => {
                        setSelectedCountry(country);
                        handleChange({
                          target: {
                            name: "country",
                            value: country?.label,
                          },
                        });
                      }}
                    />
                    {touched.country && errors.country && (
                      <FormHelperText error>{errors.country}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                {selectedCountry && (
                  <Grid container spacing={matchDownSM ? 0 : 2}>
                    {selectedCountry.phone && (
                      <Grid item xs={12} sm={3}>
                        <FormControl
                          fullWidth
                          sx={{ ...theme.typography.customInput }}
                        >
                          <InputLabel
                            htmlFor="outlined-adornment-phonecode"
                            className="flex justify-between items-center gap-2"
                          >
                            Code
                            <img
                              loading="lazy"
                              width="20"
                              srcSet={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png 2x`}
                              src={`https://flagcdn.com/w20/${selectedCountry.code.toLowerCase()}.png`}
                              alt=""
                              style={{ marginRight: "8px" }}
                            />
                          </InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-phonecode"
                            type="text"
                            value={`+ ${selectedCountry.phone}`}
                            name="phonecode"
                            readOnly
                          />
                        </FormControl>
                      </Grid>
                    )}
                    <Grid item xs={12} sm={selectedCountry.phone ? 9 : 12}>
                      <FormControl
                        fullWidth
                        error={Boolean(touched.phone && errors.phone)}
                        sx={{ ...theme.typography.customInput }}
                      >
                        <InputLabel htmlFor="outlined-adornment-phone">
                          Phone Number
                        </InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-phone"
                          type="tel"
                          value={values.phone}
                          name="phone"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          label="Phone Number"
                          inputProps={{}}
                        />
                        {touched.phone && errors.phone && (
                          <FormHelperText error>{errors.phone}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            )}

            {activeStep === 2 && (
              <Grid container spacing={matchDownSM ? 0 : 2}>
                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    error={Boolean(touched.deviceCount && errors.deviceCount)}
                    sx={{ ...theme.typography.customInput }}
                  >
                    <InputLabel htmlFor="outlined-adornment-device-count">
                      Expected IoT Device Count
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-device-count"
                      type="text"
                      value={values.deviceCount}
                      name="deviceCount"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      label="Expected IoT Device Count"
                      inputProps={{}}
                    />
                    {touched.deviceCount && errors.deviceCount && (
                      <FormHelperText error>
                        {errors.deviceCount}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            )}

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
            >
              <Button
                variant="outlined"
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  handleBack();
                }}
                disabled={activeStep === 0 || isSubmitting}
              >
                Back
              </Button>
              <AnimateButton>
                <Button
                  variant="contained"
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    if (activeStep === steps.length - 1) {
                      handleSubmit();
                    } else {
                      handleNext();
                    }
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Submitting..."
                    : activeStep === steps.length - 1
                      ? "Submit"
                      : "Next"}
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default AuthEnterpriseRegister;
