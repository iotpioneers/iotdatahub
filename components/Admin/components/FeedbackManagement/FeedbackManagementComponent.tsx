"use client";

import React, { useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  Grid,
  Typography,
  Modal,
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Button,
  Snackbar,
} from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import AnalyticsChart from "./AnalyticsChart";

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Mutation function for SWR
const sendRequest = async (url: string, { arg }: { arg: any }) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });
  return response.json();
};

// Validation schema for feedback reply
const replySchema = yup.object({
  message: yup.string().required("Reply message is required"),
});

// Define FeedbackStatus enum
enum FeedbackStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

// RequestList component
const RequestList = () => {
  const { data, error } = useSWR<any[]>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/feedback`,
    fetcher
  );

  if (error) return <div>Failed to load requests</div>;
  if (!data) return <div>Loading requests...</div>;

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 130 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "subject", headerName: "Subject", width: 200 },
    { field: "status", headerName: "Status", width: 130 },
    { field: "createdAt", headerName: "Created At", width: 200 },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columns}
        getRowId={(row) => row.id}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
        pageSizeOptions={[5, 10, 20, 50, 100]}
        autoHeight
        disableRowSelectionOnClick
        slots={{
          toolbar: GridToolbar,
        }}
      />
    </div>
  );
};

// ReplyForm component
const ReplyForm = ({
  feedbackId,
  onReplySubmit,
}: {
  feedbackId: string;
  onReplySubmit: () => void;
}) => {
  const { trigger, isMutating, error } = useSWRMutation(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/feedback-reply`,
    sendRequest
  );

  const formik = useFormik({
    initialValues: {
      message: "",
    },
    validationSchema: replySchema,
    onSubmit: async (values) => {
      try {
        await trigger({ ...values, feedbackId });
        onReplySubmit();
      } catch (error) {
        console.error("Error submitting reply:", error);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormControl
        fullWidth
        error={formik.touched.message && Boolean(formik.errors.message)}
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
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isMutating}
      >
        Submit Reply
      </Button>
      {error && <Typography color="error">Error submitting reply</Typography>}
    </form>
  );
};

// RequestDetail component
const RequestDetail = ({
  feedbackId,
  onClose,
}: {
  feedbackId: string;
  onClose: () => void;
}) => {
  const { data, error } = useSWR<any>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/feedback/${feedbackId}`,
    fetcher
  );
  const [showReplyForm, setShowReplyForm] = useState(false);

  if (error) return <div>Failed to load request details</div>;
  if (!data) return <div>Loading request details...</div>;

  return (
    <Box>
      <Typography variant="h6">{data.subject}</Typography>
      <Typography>
        From: {data.name} ({data.email})
      </Typography>
      <Typography>Status: {data.status}</Typography>
      <Typography>Message: {data.message}</Typography>
      <Typography variant="h6">Replies:</Typography>
      {data.replies.map((reply: any) => (
        <Box key={reply.id}>
          <Typography>{reply.message}</Typography>
          <Typography variant="caption">
            By: {reply.user.name} at {reply.createdAt}
          </Typography>
        </Box>
      ))}
      <Button onClick={() => setShowReplyForm(!showReplyForm)}>
        {showReplyForm ? "Cancel Reply" : "Reply"}
      </Button>
      {showReplyForm && (
        <ReplyForm feedbackId={feedbackId} onReplySubmit={onClose} />
      )}
      <Button onClick={onClose}>Close</Button>
    </Box>
  );
};

// Main FeedbackManagement component
const FeedbackManagementComponent = () => {
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleFeedbackSelect = (feedbackId: string) => {
    setSelectedFeedback(feedbackId);
  };

  const handleCloseModal = () => {
    setSelectedFeedback(null);
    setSnackbarOpen(true);
    setSnackbarMessage("Reply submitted successfully");
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4">Feedback Management</Typography>
      </Grid>
      <Grid item xs={12}>
        <AnalyticsChart />
      </Grid>
      <Grid item xs={12}>
        <RequestList />
      </Grid>
      <Modal
        open={Boolean(selectedFeedback)}
        onClose={() => setSelectedFeedback(null)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          {selectedFeedback && (
            <RequestDetail
              feedbackId={selectedFeedback}
              onClose={handleCloseModal}
            />
          )}
        </Box>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Grid>
  );
};

export default FeedbackManagementComponent;
