"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { useFormik } from "formik";
import axios from "axios";
import * as yup from "yup";
import { Subscription } from "@/types";
import LoadingProgressBar from "@/components/LoadingProgressBar";

export const subscriptionSchema = yup.object({
  name: yup
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be 255 characters or less")
    .required("Name is required"),
  description: yup.string().optional(),
  type: yup
    .mixed<"FREE" | "PREMIUM" | "ENTERPRISE">()
    .oneOf(["FREE", "PREMIUM", "ENTERPRISE"], "Invalid subscription type")
    .required("Type is required"),
  price: yup
    .number()
    .min(0, "Price must be a non-negative number")
    .required("Price is required"),
  maxChannels: yup
    .number()
    .min(0, "Max channels must be a non-negative number")
    .required("Max channels is required"),
  maxMessagesPerYear: yup
    .number()
    .min(0, "Max messages per year must be a non-negative number")
    .required("Max messages per year is required"),
  features: yup
    .array()
    .of(yup.string().required())
    .min(1, "At least one feature is required")
    .required("Features are required"),
  activation: yup.boolean().required("Activation status is required"),
});

interface SubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  subscription: Subscription | null;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  open,
  onClose,
  subscription,
}) => {
  const [value, setValue] = useState<Subscription | null>(subscription || null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formik = useFormik({
    initialValues: subscription || {
      name: "",
      description: "",
      type: "FREE",
      price: 0,
      maxChannels: 0,
      maxMessagesPerYear: 0,
      features: [],
      activation: false,
    },
    validationSchema: subscriptionSchema,
    onSubmit: async (values) => {
      setIsLoading(true);

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/subscription`,
          values
        );

        if (response.status === 200) {
          setSnackbar({
            open: true,
            message: "Subscription saved successfully",
            severity: "success",
          });
          onClose();
        } else {
          throw new Error("Failed to save subscription");
        }
      } catch (error) {
        console.error("Failed to save subscription:", error);
        setSnackbar({
          open: true,
          message: "Failed to save subscription",
          severity: "error",
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {subscription?.id ? "Edit" : "Add"} Subscription
      </DialogTitle>
      {isLoading && <LoadingProgressBar />}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            id="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            id="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Type</InputLabel>
            <Select
              id="type"
              value={formik.values.type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.type && Boolean(formik.errors.type)}
            >
              <MenuItem value="FREE">Free</MenuItem>
              <MenuItem value="PREMIUM">Premium</MenuItem>
              <MenuItem value="ENTERPRISE">Enterprise</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            id="price"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.price && Boolean(formik.errors.price)}
            helperText={formik.touched.price && formik.errors.price}
          />
          <TextField
            margin="dense"
            label="Max Channels"
            type="number"
            fullWidth
            id="maxChannels"
            value={formik.values.maxChannels}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.maxChannels && Boolean(formik.errors.maxChannels)
            }
            helperText={formik.touched.maxChannels && formik.errors.maxChannels}
          />
          <TextField
            margin="dense"
            label="Max Messages Per Year"
            type="number"
            fullWidth
            id="maxMessagesPerYear"
            value={formik.values.maxMessagesPerYear}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.maxMessagesPerYear &&
              Boolean(formik.errors.maxMessagesPerYear)
            }
            helperText={
              formik.touched.maxMessagesPerYear &&
              formik.errors.maxMessagesPerYear
            }
          />
          <TextField
            margin="dense"
            label="Features (comma-separated)"
            fullWidth
            id="features"
            value={formik.values.features.join(", ")}
            onChange={(e) =>
              formik.setFieldValue(
                "features",
                e.target.value.split(",").map((f) => f.trim())
              )
            }
            onBlur={formik.handleBlur}
            error={formik.touched.features && Boolean(formik.errors.features)}
            helperText={formik.touched.features && formik.errors.features}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Activation</InputLabel>
            <Select
              id="activation"
              value={formik.values.activation ? 1 : 0}
              onChange={(e) =>
                formik.setFieldValue("activation", e.target.value === 1)
              }
              onBlur={formik.handleBlur}
              error={
                formik.touched.activation && Boolean(formik.errors.activation)
              }
            >
              <MenuItem value={1}>Active</MenuItem>
              <MenuItem value={0}>Inactive</MenuItem>
            </Select>
          </FormControl>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionModal;
