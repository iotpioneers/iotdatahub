"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import useSWR from "swr";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Grid,
  Box,
  Typography,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  useTheme,
} from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import { Channel } from "@/types";

// Define validation schema with Yup
const deviceSchema = Yup.object().shape({
  name: Yup.string().required("Device name is required"),
  description: Yup.string().required("Description is required"),
  channelId: Yup.string().required("Channel selection is required"),
});

// Define fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DeviceForm() {
  const router = useRouter();
  const theme = useTheme();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [open, setOpen] = useState(false);

  // Use SWR to fetch channels
  const { data: channels, error: channelsError } = useSWR<Channel[]>(
    process.env.NEXT_PUBLIC_BASE_URL + "/api/channels",
    fetcher
  );

  // Close result snackbar
  const handleCloseResult = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const onSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/devices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to create device");
      }

      setOpen(true);
      setTimeout(() => {
        router.push("/dashboard/organization");
      }, 100);
    } catch (error) {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (channelsError) return <div>Failed to load channels</div>;
  if (!channels) return <div>Loading...</div>;

  return (
    <Box sx={{ p: 4 }}>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleCloseResult}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseResult} severity="success">
          Device created successfully
        </Alert>
      </Snackbar>

      <Typography variant="h4" gutterBottom>
        Add a new device
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Formik
        initialValues={{
          name: "",
          description: "",
          channelId: "",
        }}
        validationSchema={deviceSchema}
        onSubmit={onSubmit}
      >
        {({ errors, handleBlur, handleChange, touched, values }) => (
          <Form noValidate>
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                error={Boolean(touched.name && errors.name)}
                sx={{ ...theme.typography.customInput }}
              >
                <InputLabel htmlFor="outlined-adornment-name-register">
                  Device Name
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-name-register"
                  type="text"
                  value={values.name}
                  name="name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  inputProps={{}}
                />
                {touched.name && errors.name && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-name-register"
                  >
                    {errors.name}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <FormControl
              fullWidth
              error={Boolean(touched.channelId && errors.channelId)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="outlined-adornment-channel-register">
                Channel
              </InputLabel>
              <Select
                id="outlined-adornment-channel-register"
                value={values.channelId}
                name="channelId"
                label="Channel"
                onBlur={handleBlur}
                onChange={handleChange}
              >
                {channels.map((channel) => (
                  <MenuItem key={channel.id} value={channel.id}>
                    {channel.name}
                  </MenuItem>
                ))}
              </Select>
              {touched.channelId && errors.channelId && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text-channel-register"
                >
                  {errors.channelId}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
              <SimpleMDE
                id="outlined-adornment-description-register"
                value={values.description}
                onChange={(value) =>
                  handleChange({ target: { name: "description", value } })
                }
                placeholder="Enter some information about the device..."
              />
            </FormControl>

            <Box sx={{ mt: 2 }}>
              <Button
                disableElevation
                disabled={isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="secondary"
                startIcon={<CloudUploadIcon />}
              >
                {isSubmitting ? "Submitting..." : "Add Device"}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
