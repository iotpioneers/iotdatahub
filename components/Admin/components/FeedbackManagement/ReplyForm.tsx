"use client";

import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Button,
  Box,
} from "@mui/material";
import { ReplyFormValues } from "@/types";

interface ReplyFormProps {
  onSubmit: (values: ReplyFormValues) => Promise<void>;
  onCancel: () => void;
}

const replySchema = yup.object({
  message: yup.string().required("Reply message is required"),
});

export const ReplyForm: React.FC<ReplyFormProps> = ({ onSubmit, onCancel }) => {
  const formik = useFormik<ReplyFormValues>({
    initialValues: {
      message: "",
    },
    validationSchema: replySchema,
    onSubmit: async (values, { resetForm }) => {
      await onSubmit(values);
      resetForm();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormControl
        fullWidth
        error={formik.touched.message && Boolean(formik.errors.message)}
        sx={{ mb: 2 }}
      >
        <InputLabel htmlFor="message">Reply Message</InputLabel>
        <OutlinedInput
          id="message"
          name="message"
          label="Reply Message"
          value={formik.values.message}
          onChange={formik.handleChange}
          multiline
          rows={4}
        />
        <FormHelperText>
          {formik.touched.message && formik.errors.message}
        </FormHelperText>
      </FormControl>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary">
          Send Reply
        </Button>
      </Box>
    </form>
  );
};
