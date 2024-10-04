"use client";

import React, { useState } from "react";
import {
  Grid,
  Typography,
  Modal,
  Box,
  Snackbar,
  IconButton,
  Tooltip,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Reply, MessageCircle } from "lucide-react";
import useSWR from "swr";
import { ReplyForm } from "./ReplyForm";
import { FeedbackDetail } from "./FeedbackDetail";
import { Feedback, ReplyFormValues } from "@/types";
import AnalyticsChart from "./AnalyticsChart";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Define the mutation function type
type SendReplyFn = (
  url: string,
  data: ReplyFormValues & { feedbackId: string }
) => Promise<any>;

// Update the sendReply function to match the expected signature
const sendReply: SendReplyFn = async (url, data) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

function useFeedbackDetail(feedbackId: string | null) {
  const { data, error, mutate } = useSWR<Feedback>(
    feedbackId
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/feedback/${feedbackId}`
      : null,
    fetcher
  );

  return {
    feedback: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

function useFeedbackData() {
  const { data, error, mutate } = useSWR<Feedback[]>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/feedback`,
    fetcher
  );

  return {
    feedbacks: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

const FeedbackManagementComponent: React.FC = () => {
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(
    null
  );
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const { feedbacks, isLoading, mutate: mutateFeedbacks } = useFeedbackData();
  const { feedback: selectedFeedback } = useFeedbackDetail(selectedFeedbackId);

  const handleReplySubmit = async (values: ReplyFormValues) => {
    if (!selectedFeedbackId) return;

    try {
      await sendReply(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/feedback-reply`,
        {
          ...values,
          feedbackId: selectedFeedbackId,
        }
      );

      setReplyModalOpen(false);
      setSnackbarMessage("Reply sent successfully");
      setSnackbarOpen(true);
      mutateFeedbacks();
    } catch (error) {
      setSnackbarMessage("Failed to send reply");
      setSnackbarOpen(true);
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 130 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "subject", headerName: "Subject", width: 200 },
    { field: "status", headerName: "Status", width: 130 },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 200,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View Details">
            <IconButton
              onClick={() => setSelectedFeedbackId(params.row.id)}
              size="small"
            >
              <MessageCircle size={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Quick Reply">
            <IconButton
              onClick={() => {
                setSelectedFeedbackId(params.row.id);
                setReplyModalOpen(true);
              }}
              size="small"
            >
              <Reply size={20} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4">Feedback Management</Typography>
      </Grid>

      <Grid item xs={12}>
        <AnalyticsChart />
      </Grid>

      <Grid item xs={12}>
        <DataGrid
          rows={feedbacks || []}
          columns={columns}
          getRowId={(row: Feedback) => row.id}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
          pageSizeOptions={[5, 10, 20, 50, 100]}
          autoHeight
          disableRowSelectionOnClick
        />
      </Grid>

      {/* Quick Reply Modal */}
      <Modal open={replyModalOpen} onClose={() => setReplyModalOpen(false)}>
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
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" mb={2}>
            Quick Reply to {selectedFeedback?.name}
          </Typography>
          <Typography variant="body2" mb={2}>
            Re: {selectedFeedback?.subject}
          </Typography>
          <ReplyForm
            onSubmit={handleReplySubmit}
            onCancel={() => setReplyModalOpen(false)}
          />
        </Box>
      </Modal>

      {/* Detail Modal */}
      <Modal
        open={Boolean(selectedFeedbackId) && !replyModalOpen}
        onClose={() => setSelectedFeedbackId(null)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxHeight: "80vh",
            overflow: "auto",
          }}
        >
          {selectedFeedback && <FeedbackDetail feedback={selectedFeedback} />}
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
