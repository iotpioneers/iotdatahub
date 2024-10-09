"use client";

import React, { useState, useRef } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Box,
  Typography,
  IconButton,
  InputBase,
  Paper,
  Popover,
} from "@mui/material";
import { Send, Paperclip, Mic } from "lucide-react";
import { ReplyFormValues, Feedback, FeedbackReply } from "@/types";
import { HiEmojiHappy } from "react-icons/hi";
import EmojiPicker from "emoji-picker-react";

interface ReplyFormProps {
  onSubmit: (values: ReplyFormValues) => Promise<void>;
  onCancel: () => void;
  feedback: Feedback;
}

const replySchema = yup.object({
  message: yup.string().required("Reply message is required"),
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const ReplyForm: React.FC<ReplyFormProps> = ({
  onSubmit,
  onCancel,
  feedback,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formik = useFormik<ReplyFormValues>({
    initialValues: {
      message: "",
    },
    validationSchema: replySchema,
    onSubmit: async (values, { resetForm }) => {
      // Here you would typically handle the file upload along with the message
      const formData = new FormData();
      formData.append("message", values.message);
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      await onSubmit(values);
      resetForm();
      setSelectedFile(null);
    },
  });

  const handleEmojiClick = (emojiData: any) => {
    formik.setFieldValue("message", formik.values.message + emojiData.emoji);
    setAnchorEl(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      alert(
        "Invalid file type. Please select an image, PDF, or document file."
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert("File is too large. Maximum size is 5MB.");
      return;
    }

    setSelectedFile(file);
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        maxHeight: "800px",
        width: "100%",
        bgcolor: "#f0f2f5",
        borderRadius: 2,
        pb: 2,
      }}
    >
      {/* Chat header */}
      <Box
        sx={{
          bgcolor: "#075e54",
          color: "white",
          p: 2,
          display: "flex",
          alignItems: "center",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      >
        <Typography variant="h6">{feedback.name}</Typography>
      </Box>

      {/* Chat messages */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Original message */}
        <Box
          sx={{
            alignSelf: "flex-start",
            bgcolor: "white",
            borderRadius: 2,
            p: 2,
            mb: 2,
            maxWidth: "70%",
            boxShadow: 1,
          }}
        >
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            {feedback.name} • {new Date(feedback.createdAt).toLocaleString()}
          </Typography>
          <Typography variant="body1">{feedback.message}</Typography>
        </Box>

        {/* Reply messages */}
        {feedback.replies?.map((reply: FeedbackReply) => (
          <Box
            key={reply.id}
            sx={{
              alignSelf: "flex-end", // Assuming all replies are from admin
              bgcolor: "#dcf8c6",
              borderRadius: 2,
              p: 2,
              mb: 2,
              maxWidth: "70%",
              boxShadow: 1,
            }}
          >
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              {reply.user?.name || "Admin"} •{" "}
              {new Date(reply.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="body1">{reply.message}</Typography>
          </Box>
        ))}
      </Box>

      {/* Reply form */}
      <Paper
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: "100%",
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        }}
        elevation={3}
      >
        <IconButton
          sx={{ p: "10px" }}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          <HiEmojiHappy />
        </IconButton>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </Popover>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
          accept={ALLOWED_FILE_TYPES.join(",")}
        />

        <IconButton
          sx={{ p: "10px" }}
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip />
        </IconButton>

        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Type a message"
            inputProps={{ "aria-label": "type a message" }}
            name="message"
            value={formik.values.message}
            onChange={formik.handleChange}
            error={formik.touched.message && Boolean(formik.errors.message)}
            multiline
            maxRows={4}
          />
          {selectedFile && (
            <Box sx={{ ml: 1, mt: 1, display: "flex", alignItems: "center" }}>
              <Typography variant="caption" color="textSecondary">
                Attached: {selectedFile.name}
              </Typography>
              <IconButton
                size="small"
                onClick={() => setSelectedFile(null)}
                sx={{ ml: 1 }}
              >
                ×
              </IconButton>
            </Box>
          )}
        </Box>

        {formik.values.message || selectedFile ? (
          <IconButton type="submit" sx={{ p: "10px" }}>
            <Send />
          </IconButton>
        ) : (
          <IconButton sx={{ p: "10px" }} disabled>
            <Mic />
          </IconButton>
        )}
      </Paper>
    </Box>
  );
};
