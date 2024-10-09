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
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import {
  Reply,
  MoreVertical,
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
} from "lucide-react";
import useSWR from "swr";
import { ReplyForm } from "./ReplyForm";
import { Feedback, FeedbackStatus, ReplyFormValues } from "@/types";
import AnalyticsChart from "./AnalyticsChart";
import { FaHourglassHalf } from "react-icons/fa6";
import { a } from "react-spring";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type SendReplyFn = (
  url: string,
  data: ReplyFormValues & { feedbackId: string }
) => Promise<any>;

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

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

  const handleStatusChange = async (
    feedbackId: string,
    newStatus: FeedbackStatus
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/feedback/${feedbackId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      console.log("response", response);

      if (response.ok) {
        mutateFeedbacks();
        setSnackbarMessage(`Status updated to ${newStatus}`);
        setSnackbarOpen(true);
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      setSnackbarMessage("Failed to update status");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteConfirm = () => {
    setDeleteConfirmOpen(true);
    handleMenuClose();
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setSelectedFeedbackId(null);
  };

  const handleDeleteConfirmed = async () => {
    if (!selectedFeedbackId) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/feedback/${selectedFeedbackId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        mutateFeedbacks();
        setSnackbarMessage("Feedback deleted successfully");
        setSnackbarOpen(true);
      } else {
        throw new Error("Failed to delete feedback");
      }
    } catch (error) {
      console.error("Error deleting feedback:", error);
      setSnackbarMessage("Failed to delete feedback");
      setSnackbarOpen(true);
    } finally {
      setDeleteConfirmOpen(false);
      setSelectedFeedbackId(null);
    }
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    feedbackId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedFeedbackId(feedbackId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getStatusIcon = (status: FeedbackStatus) => {
    switch (status) {
      case FeedbackStatus.PENDING:
        return <Clock size={20} />;
      case FeedbackStatus.IN_PROGRESS:
        return <FaHourglassHalf size={20} />;
      case FeedbackStatus.RESOLVED:
        return <CheckCircle size={20} />;
      case FeedbackStatus.CLOSED:
        return <XCircle size={20} />;
      default:
        return null;
    }
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Sender", width: 130 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "subject", headerName: "Subject", width: 200 },
    { field: "message", headerName: "Message" },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
          {getStatusIcon(params.value as FeedbackStatus)}
          <Typography>{params.value}</Typography>
        </Box>
      ),
    },
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
      renderCell: (params: GridRenderCellParams) => (
        <Box>
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
          <Tooltip title="More Actions">
            <IconButton
              onClick={(event) => handleMenuOpen(event, params.row.id)}
              size="small"
            >
              <MoreVertical size={20} />
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
          slots={{
            toolbar: GridToolbar,
          }}
        />
      </Grid>

      <Modal open={replyModalOpen} onClose={() => setReplyModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            mt: 4,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {selectedFeedback && (
            <ReplyForm
              onSubmit={handleReplySubmit}
              onCancel={() => setReplyModalOpen(false)}
              feedback={selectedFeedback}
            />
          )}
        </Box>
      </Modal>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            handleStatusChange(selectedFeedbackId!, FeedbackStatus.PENDING);
            handleMenuClose();
          }}
        >
          <Clock size={16} style={{ marginRight: 8 }} />
          Mark as Pending
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleStatusChange(selectedFeedbackId!, FeedbackStatus.IN_PROGRESS);
            handleMenuClose();
          }}
        >
          <FaHourglassHalf size={16} style={{ marginRight: 8 }} />
          Mark as In Progress
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleStatusChange(selectedFeedbackId!, FeedbackStatus.RESOLVED);
            handleMenuClose();
          }}
        >
          <CheckCircle size={16} style={{ marginRight: 8 }} />
          Mark as Resolved
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleStatusChange(selectedFeedbackId!, FeedbackStatus.CLOSED);
            handleMenuClose();
          }}
        >
          <XCircle size={16} style={{ marginRight: 8 }} />
          Mark as Closed
        </MenuItem>
        <MenuItem onClick={handleDeleteConfirm}>
          <Trash2 size={16} style={{ marginRight: 8, color: "red" }} />
          Delete
        </MenuItem>
      </Menu>

      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this feedback? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirmed} autoFocus color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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
