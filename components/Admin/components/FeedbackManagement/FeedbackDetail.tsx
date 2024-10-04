"use client";

import React from "react";
import { Typography, Box } from "@mui/material";
import { Feedback } from "@/types";

interface FeedbackDetailProps {
  feedback: Feedback;
}

export const FeedbackDetail: React.FC<FeedbackDetailProps> = ({ feedback }) => {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        {feedback.subject}
      </Typography>
      <Typography variant="body2" gutterBottom>
        From: {feedback.name} ({feedback.email})
      </Typography>
      <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
        {feedback.message}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Replies
      </Typography>
      {feedback.replies?.map((reply) => (
        <Box
          key={reply.id}
          sx={{
            mb: 2,
            p: 2,
            bgcolor: "grey.50",
            borderRadius: 1,
          }}
        >
          <Typography variant="body1">{reply.message}</Typography>
          <Typography variant="caption" color="text.secondary">
            By: {reply.user.name} at{" "}
            {new Date(reply.createdAt).toLocaleString()}
          </Typography>
        </Box>
      ))}
    </>
  );
};
