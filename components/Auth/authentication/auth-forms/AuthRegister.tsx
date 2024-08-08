"use client";

import React, { useEffect, useState } from "react";
import { configureStore } from "@reduxjs/toolkit";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSelector } from "react-redux";
import axios from "axios";

// material-ui
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

// project imports
import AnimateButton from "../../AnimateButton";
import {
  strengthColor,
  strengthIndicator,
} from "@/app/utils/password-strength";
import reducer from "@/app/store/reducer";
import LoadingProgressBar from "@/components/LoadingProgressBar";

// assets
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CountryList from "./CountryList";
import { useRouter } from "next/navigation";

const store = configureStore({ reducer });

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;

type LevelType =
  | {
      label: string;
      color: string;
    }
  | undefined;

interface CountryType {
  code: string;
  label: string;
  phone: string;
  suggested?: boolean;
}

const schema = Yup.object().shape({
  firstname: Yup.string().max(255).required("Firstname is required"),
  lastname: Yup.string().max(255).required("Lastname is required"),
  email: Yup.string()
    .email("Must be a valid email")
    .max(255)
    .required("Email is required"),
  country: Yup.string().optional(),
  phonecode: Yup.string().optional(),
  phonenumber: Yup.number()
    .typeError("Must be a valid phone number")
    .required("Phone is required"),

  password: Yup.string().min(8).max(255).required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

type FormData = Yup.InferType<typeof schema>;

const AuthRegister = ({ ...others }) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
  const customization = useSelector((state: RootState) => state.customization);

  const [isGoogleSign, setIsGoogleSign] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(false);
  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState<LevelType>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryType | null>(
    null
  );

  const router = useRouter();

  const googleHandler = async () => {
    setIsGoogleSign(true);
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const changePassword = (value: string) => {
    const temp = strengthIndicator(value);
    setStrength(temp);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword("");
  }, []);

  const handleCloseResult = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const registerUser = async (data: FormData) => {
    const phoneCode = selectedCountry?.phone || "";
    const phoneNumber = data.phonenumber
      ? `${phoneCode} ${data.phonenumber}`
      : data.phonenumber;

    setError(null);
    setLoading(true);

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        name: data.firstname + " " + data.lastname,
        country: selectedCountry?.label || "",
        phonenumber: phoneNumber,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setLoading(false);
      setError(result.message);
      setOpen(true);
      return;
    }

    try {
      setError(null);
      setLoading(true);
      const response = await axios.post("/api/email/send", {
        userFullName: data.firstname + " " + data.lastname,
        userEmail: data.email,
      });

      if (response.status !== 200) {
        setError("Failed to send verification email");
        setOpen(true);
        setLoading(false);
      }

      setSuccess(
        `We have sent an email to your email account : ${data.email}. Please check your email and click on the link to verify your email address.`
      );
      setOpen(true);
      setLoading(false);
      setError(null);
      setTimeout(() => {
        router.push("/dashboard");
      }, 10000);
    } catch (error) {
      setError("Failed to send verification email");
      setOpen(true);
      setLoading(false);
    }

    setError(result.message);
    setOpen(true);
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        autoHideDuration={6000}
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

      <Grid container direction="column" justifyContent="center" spacing={2}>
        <Grid item xs={12}>
          <AnimateButton>
            <Button
              type="button"
              disableElevation
              fullWidth
              onClick={googleHandler}
              size="large"
              variant="outlined"
              sx={{
                color: "grey.700",
                backgroundColor: theme.palette.grey[50],
                borderColor: theme.palette.grey[100],
              }}
            >
              <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
                <img
                  src="/socials/social-google.svg"
                  alt="google"
                  width={16}
                  height={16}
                  style={{ marginRight: matchDownSM ? 8 : 16 }}
                />
              </Box>
              Sign in with Google
            </Button>
          </AnimateButton>
          {isGoogleSign && <LoadingProgressBar />}
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ alignItems: "center", display: "flex" }}>
            <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
            <Button
              variant="outlined"
              sx={{
                cursor: "unset",
                m: 2,
                py: 0.5,
                px: 7,
                borderColor: `${theme.palette.grey[100]} !important`,
                color: `${theme.palette.grey[900]}!important`,
                fontWeight: 500,
                borderRadius: `${customization.borderRadius}px`,
              }}
              disableRipple
              disabled
            >
              OR
            </Button>
            <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          container
          alignItems="center"
          justifyContent="center"
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">
              Sign up with Email address
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Formik
        initialValues={{
          firstname: "",
          lastname: "",
          email: "",
          country: "",
          phonecode: "",
          phonenumber: 0,
          password: "",
          confirmPassword: "",
          submit: null,
        }}
        validationSchema={schema}
        onSubmit={(values, actions) => {
          registerUser(values);
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
        }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <Grid container spacing={matchDownSM ? 0 : 2}>
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  error={Boolean(touched.firstname && errors.firstname)}
                  sx={{ ...theme.typography.customInput }}
                >
                  <InputLabel htmlFor="outlined-adornment-firstname-register">
                    First Name
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-firstname-register"
                    type="text"
                    value={values.firstname}
                    name="firstname"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    inputProps={{}}
                  />
                  {touched.firstname && errors.firstname && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text--register"
                    >
                      {errors.firstname}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  error={Boolean(touched.lastname && errors.lastname)}
                  sx={{ ...theme.typography.customInput }}
                >
                  <InputLabel htmlFor="outlined-adornment-lastname-register">
                    Last Name
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-lastname-register"
                    type="text"
                    value={values.lastname}
                    name="lastname"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    inputProps={{}}
                  />
                  {touched.lastname && errors.lastname && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text--register"
                    >
                      {errors.lastname}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            <FormControl
              fullWidth
              error={Boolean(touched.email && errors.email)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="outlined-adornment-email-register">
                Email Address
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-register"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text--register"
                >
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>
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
                      value: selectedCountry?.label,
                    },
                  });
                }}
              />

              {touched.country && errors.country && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text--register"
                >
                  {errors.country}
                </FormHelperText>
              )}
            </FormControl>
            <Grid container spacing={matchDownSM ? 0 : 2}>
              {selectedCountry?.phone && (
                <Grid item xs={12} sm={3}>
                  <FormControl
                    fullWidth
                    sx={{ ...theme.typography.customInput }}
                  >
                    <InputLabel htmlFor="outlined-adornment-phonecode-register">
                      Code
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-phonecode"
                      type="text"
                      value={`+ ${selectedCountry?.phone}`}
                      name="phonecode"
                    />
                  </FormControl>
                </Grid>
              )}
              <Grid item xs={12} sm={selectedCountry?.phone ? 9 : 12}>
                <FormControl
                  fullWidth
                  error={Boolean(touched.phonenumber && errors.phonenumber)}
                  sx={{ ...theme.typography.customInput }}
                >
                  <InputLabel htmlFor="outlined-adornment-phonenumber-register">
                    Phone Number
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-phonenumber-register"
                    type="number"
                    value={values.phonenumber}
                    name="phonenumber"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    inputProps={{}}
                  />
                  {touched.phonenumber && errors.phonenumber && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text--register"
                    >
                      {errors.phonenumber}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            <FormControl
              fullWidth
              error={Boolean(touched.password && errors.password)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="outlined-adornment-password-register">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-register"
                type={showPassword ? "text" : "password"}
                value={values.password}
                name="password"
                label="Password"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                  changePassword(e.target.value);
                }}
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
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text-password-register"
                >
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>

            {strength !== 0 && level && (
              <FormControl fullWidth>
                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Box
                        style={{ backgroundColor: level?.color }}
                        sx={{ width: 85, height: 8, borderRadius: "7px" }}
                      ></Box>
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" fontSize="0.75rem">
                        {level.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </FormControl>
            )}
            {level && level.label === "Strong" && (
              <FormControl
                fullWidth
                error={Boolean(
                  touched.confirmPassword && errors.confirmPassword
                )}
                sx={{ ...theme.typography.customInput }}
              >
                <InputLabel htmlFor="outlined-adornment-confirmPassword-register">
                  Confirm Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-confirmPassword-register"
                  type="password"
                  value={values.confirmPassword}
                  name="confirmPassword"
                  label="Confirm Password"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  inputProps={{}}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-confirmPassword-register"
                  >
                    {errors.confirmPassword}
                  </FormHelperText>
                )}
              </FormControl>
            )}
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={(event) => setChecked(event.target.checked)}
                      name="checked"
                      color="primary"
                    />
                  }
                  label={
                    <Link href="#">
                      <Typography variant="subtitle1">
                        Agree with Terms & Conditions
                      </Typography>
                    </Link>
                  }
                />
              </Grid>
            </Grid>

            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={!checked || isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="secondary"
                >
                  {isSubmitting || loading
                    ? "Registering you in please wait..."
                    : "Sign up"}
                </Button>
                {loading && <LoadingProgressBar />}
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthRegister;
