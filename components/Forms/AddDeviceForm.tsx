"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik } from "formik";
import * as Yup from "yup";
import { Activity, Package, MapPin, Settings } from "lucide-react";
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
  Switch,
  Alert,
  Button,
  OutlinedInput,
} from "@mui/material";
import { Channel } from "@/types";

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
  description: Yup.string()
    .max(1000, "Description must be 1000 characters or less")
    .required("Please a small description for this device"),
  deviceType: Yup.string()
    .oneOf(
      deviceTypes.map((type) => type.value),
      "Invalid device type"
    )
    .required("Device type is required"),
  channelId: Yup.string().required("Channel selection is required"),
  model: Yup.string().optional(),
  firmware: Yup.string().optional(),
  ipAddress: Yup.string()
    .test({
      name: "ipAddress",
      skipAbsent: true,
      test: (value) => {
        if (!value) return true;
        return /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
          value
        );
      },
      message: "Please enter a valid IPv4 address",
    })
    .nullable(),
  macAddress: Yup.string()
    .test({
      name: "macAddress",
      skipAbsent: true,
      test: (value) => {
        if (!value) return true;
        return /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(value);
      },
      message: "Please enter a valid MAC address (format: XX:XX:XX:XX:XX:XX)",
    })
    .nullable(),
  location: Yup.object().shape({
    latitude: Yup.number()
      .min(-90, "Latitude must be between -90 and 90")
      .max(90, "Latitude must be between -90 and 90")
      .optional()
      .nullable(),
    longitude: Yup.number()
      .min(-180, "Longitude must be between -180 and 180")
      .max(180, "Longitude must be between -180 and 180")
      .optional()
      .nullable(),
    altitude: Yup.number().optional().nullable(),
  }),
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
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  console.log("showAdvanced", showAdvanced);

  const { data: channels, error: channelsError } = useSWR<Channel[], Error>(
    "/api/channels",
    fetcher
  );

  const initialValues = {
    name: "",
    description: "",
    deviceType: "SENSOR",
    channelId: "",
    model: "",
    firmware: "",
    ipAddress: "",
    macAddress: "",
    location: {
      latitude: 0,
      longitude: 0,
      altitude: 0,
    },
    config: {},
    metadata: {},
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

      router.push("/dashboard/devices");
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
        <div className="flex items-center gap-2 mb-6">
          <Package className="w-6 h-6" />
          <Typography variant="h4">Add New Device</Typography>
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
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl
                    fullWidth
                    error={Boolean(touched.name && errors.name)}
                  >
                    <InputLabel htmlFor="name">Device Name</InputLabel>
                    <OutlinedInput
                      id="name"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="Device Name"
                    />
                    {touched.name && errors.name && (
                      <FormHelperText error>{errors.name}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
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
                </Grid>

                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    error={Boolean(touched.description && errors.description)}
                  >
                    <InputLabel htmlFor="description">Description</InputLabel>
                    <OutlinedInput
                      id="description"
                      name="description"
                      multiline
                      rows={3}
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      label="Description"
                    />
                    {touched.description && errors.description && (
                      <FormHelperText error>
                        {errors.description}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

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

                <Grid item xs={12}>
                  <div className="flex items-center justify-between mb-2">
                    <Typography
                      variant="subtitle1"
                      className="flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Advanced Settings
                    </Typography>
                    <Switch
                      checked={showAdvanced}
                      onChange={(e) => setShowAdvanced(e.target.checked)}
                    />
                  </div>
                </Grid>

                {showAdvanced && (
                  <>
                    <Grid item xs={12} md={6}>
                      <FormControl
                        fullWidth
                        error={Boolean(touched.ipAddress && errors.ipAddress)}
                      >
                        <InputLabel htmlFor="ipAddress">IP Address</InputLabel>
                        <OutlinedInput
                          id="ipAddress"
                          name="ipAddress"
                          value={values.ipAddress}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          label="IP Address"
                        />
                        {touched.ipAddress && errors.ipAddress && (
                          <FormHelperText error>
                            {errors.ipAddress}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl
                        fullWidth
                        error={Boolean(touched.macAddress && errors.macAddress)}
                      >
                        <InputLabel htmlFor="macAddress">
                          MAC Address
                        </InputLabel>
                        <OutlinedInput
                          id="macAddress"
                          name="macAddress"
                          value={values.macAddress}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          label="MAC Address"
                        />
                        {touched.macAddress && errors.macAddress && (
                          <FormHelperText error>
                            {errors.macAddress}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle1"
                        className="flex items-center gap-2 mb-2"
                      >
                        <MapPin className="w-4 h-4" />
                        Device Location
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <FormControl
                            fullWidth
                            error={Boolean(
                              touched.location?.latitude &&
                                errors.location?.latitude
                            )}
                          >
                            <InputLabel htmlFor="location.latitude">
                              Latitude
                            </InputLabel>
                            <OutlinedInput
                              id="location.latitude"
                              name="location.latitude"
                              type="number"
                              value={values.location.latitude}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              label="Latitude"
                            />
                            {touched.location?.latitude &&
                              errors.location?.latitude && (
                                <FormHelperText error>
                                  {errors.location.latitude}
                                </FormHelperText>
                              )}
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <FormControl
                            fullWidth
                            error={Boolean(
                              touched.location?.longitude &&
                                errors.location?.longitude
                            )}
                          >
                            <InputLabel htmlFor="location.longitude">
                              Longitude
                            </InputLabel>
                            <OutlinedInput
                              id="location.longitude"
                              name="location.longitude"
                              type="number"
                              value={values.location.longitude}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              label="Longitude"
                            />
                            {touched.location?.longitude &&
                              errors.location?.longitude && (
                                <FormHelperText error>
                                  {errors.location.longitude}
                                </FormHelperText>
                              )}
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <FormControl
                            fullWidth
                            error={Boolean(
                              touched.location?.altitude &&
                                errors.location?.altitude
                            )}
                          >
                            <InputLabel htmlFor="location.altitude">
                              Altitude
                            </InputLabel>
                            <OutlinedInput
                              id="location.altitude"
                              name="location.altitude"
                              type="number"
                              value={values.location.altitude}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              label="Altitude"
                            />
                            {touched.location?.altitude &&
                              errors.location?.altitude && (
                                <FormHelperText error>
                                  {errors.location.altitude}
                                </FormHelperText>
                              )}
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                  </>
                )}
              </Grid>

              <div className="flex justify-end gap-4 mt-6">
                <Button
                  variant="outlined"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting || loading}
                >
                  {loading ? "Creating..." : "Create Device"}
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
