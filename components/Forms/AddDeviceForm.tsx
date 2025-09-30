"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik } from "formik";
import * as Yup from "yup";
import { Activity } from "lucide-react";
import useSWR from "swr";

import {
  Card,
  CardContent,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Alert,
  Button,
  OutlinedInput,
  useTheme,
} from "@mui/material";
import { Channel } from "@/types/uni-types";

const deviceTypes = [
  { value: "SENSOR", label: "Sensor" },
  { value: "ACTUATOR", label: "Actuator" },
  { value: "GATEWAY", label: "Gateway" },
  { value: "CONTROLLER", label: "Controller" },
  { value: "OTHER", label: "Other" },
] as const;

// Device form validation schema
const deviceSchema = Yup.object().shape({
  name: Yup.string()
    .max(255, "Name must be 255 characters or less")
    .required("Device name is required"),
  deviceType: Yup.string()
    .oneOf(
      deviceTypes.map((type) => type.value),
      "Invalid device type"
    )
    .required("Device type is required")
    .matches(/^[a-zA-Z0-9'\-_ ]+$/, "Invalid device type"),
  channelId: Yup.string().required("Channel selection is required"),
});

const fetcher = async (url: string): Promise<Channel[]> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch channels");
  }
  return response.json();
};

const AddDeviceFormComponent: React.FC = () => {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const theme = useTheme();

  const { data: channels, error: channelsError } = useSWR<Channel[], Error>(
    "/api/channels",
    fetcher
  );

  const initialValues = {
    name: "",
    deviceType: "SENSOR",
    channelId: "",
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting, setFieldError }: any
  ) => {
    setLoading(true);
    try {
      const response = await fetch("/api/devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data.details) {
          data.details.forEach((error: any) => {
            setFieldError(error.path.join("."), error.message);
          });
          throw new Error("Please correct the validation errors");
        }
        throw new Error(data.error || "Failed to create device");
      }

      router.push(`/dashboard/devices/${data.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  if (channelsError) {
    return <Alert severity="error">Failed to load channels</Alert>;
  }

  if (!channels) {
    return (
      <div className="flex justify-center p-8">
        <Activity className="animate-spin" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-10">
          <Typography variant="h4">
            Create a new device by filling the form below
          </Typography>
        </div>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={deviceSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit} noValidate>
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  error={Boolean(touched.channelId && errors.channelId)}
                >
                  <InputLabel>Channel</InputLabel>
                  <Select
                    name="channelId"
                    value={values.channelId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label="Channel"
                  >
                    {channels.map((channel) => (
                      <MenuItem key={channel.id} value={channel.id}>
                        {channel.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.channelId && errors.channelId && (
                    <FormHelperText error>{errors.channelId}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <FormControl
                fullWidth
                error={Boolean(touched.name && errors.name)}
                sx={{ ...theme.typography.customInput }}
              >
                <InputLabel htmlFor="outlined-adornment-name-login">
                  Device Name
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-name-login"
                  type="name"
                  value={values.name}
                  name="name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  label="Device Name"
                />
                {touched.name && errors.name && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-name-login"
                  >
                    {errors.name}
                  </FormHelperText>
                )}
              </FormControl>

              <FormControl
                fullWidth
                error={Boolean(touched.deviceType && errors.deviceType)}
              >
                <InputLabel>Device Type</InputLabel>
                <Select
                  name="deviceType"
                  value={values.deviceType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label="Device Type"
                >
                  {deviceTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
                {touched.deviceType && errors.deviceType && (
                  <FormHelperText error>{errors.deviceType}</FormHelperText>
                )}
              </FormControl>

              <div className="flex justify-start gap-4 mt-6">
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting || loading}
                >
                  {loading || isSubmitting ? "Creating..." : "Create Device"}
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};

export default AddDeviceFormComponent;
