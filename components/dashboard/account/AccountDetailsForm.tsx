"use client";

import React, { useEffect, useState } from "react";
import { configureStore } from "@reduxjs/toolkit";

import { useSession } from "next-auth/react";
import { useGlobalState } from "@/context";
import { redirect } from "next/navigation";

// material-ui
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

// project imports
import reducer from "@/app/store/reducer";
import LoadingProgressBar from "@/components/LoadingProgressBar";

const store = configureStore({ reducer });

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;

interface CountryType {
  code: string;
  label: string;
  phone: string;
  suggested?: boolean;
}

const schema = Yup.object().shape({
  firstname: Yup.string().max(255).required("Firstname is required"),
  lastname: Yup.string().max(255).required("Lastname is required"),
});

type FormData = Yup.InferType<typeof schema>;

export function AccountDetailsForm({ ...others }): React.JSX.Element {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));

  const { state, updateUserData, isLoading } = useGlobalState();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success",
  );
  const { status } = useSession();
  const [selectedCountry, setSelectedCountry] = useState<CountryType | null>(
    null,
  );

  const { currentUser } = state;

  if (
    (status !== "loading" && status === "unauthenticated") ||
    currentUser === null
  ) {
    redirect("/login");
  }

  useEffect(() => {
    if (currentUser) {
      const countryData = {
        code: currentUser.phonenumber.split(" ")[0] || "",
        label: currentUser.country || "",
        phone: currentUser.phonenumber.split(" ")[1] || "",
      };
      setSelectedCountry(countryData);
    }
  }, [currentUser, status]);

  const handleUpdateUserData = async (data: FormData) => {
    if (currentUser) {
      try {
        const updatedUserData = {
          ...currentUser,
          ...data,
          name: `${data.firstname} ${data.lastname}`,
        };
        await updateUserData(updatedUserData);
        setSnackbarMessage("User data updated successfully");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      } catch (error) {
        setSnackbarMessage("Failed to update user data");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    }
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Formik
        initialValues={{
          firstname: currentUser?.name?.split(" ")[0] || "",
          lastname: currentUser?.name?.split(" ")[1] || "",
          country: currentUser?.country || "",
          phonecode: currentUser?.phonenumber?.split(" ")[0] || "",
          phonenumber: currentUser?.phonenumber?.split(" ")[1] || "",
          submit: null,
        }}
        validationSchema={schema}
        onSubmit={(values, actions) => {
          handleUpdateUserData(values);
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
            <Grid container spacing={matchDownSM ? 0 : 2}>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                  <InputLabel
                    htmlFor="outlined-adornment-phonecode-register"
                    className="flex justify-between items-center gap-2"
                  >
                    Code
                    <img
                      loading="lazy"
                      width="20"
                      srcSet={`https://flagcdn.com/w40/${selectedCountry?.code.toLowerCase()}.png 2x`}
                      src={`https://flagcdn.com/w20/${selectedCountry?.code.toLowerCase()}.png`}
                      alt=""
                      style={{ marginRight: "8px" }}
                    />
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-phonecode"
                    type="text"
                    value={`+${values.phonecode}`}
                    name="phonecode"
                    readOnly
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={9}>
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
                    type="tel"
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

            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <Button
                disableElevation
                disabled={isSubmitting || isLoading}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="secondary"
              >
                {isSubmitting || isLoading
                  ? "Please wait while saving changes..."
                  : "Save Changes"}
              </Button>
              {isSubmitting || (isLoading && <LoadingProgressBar />)}
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
}
