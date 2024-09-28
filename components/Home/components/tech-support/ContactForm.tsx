"use client";

import React, { useState } from "react";
import useSWRMutation from "swr/mutation";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Snackbar,
  Container,
  CircularProgress,
} from "@mui/material";
import AuthWrapper1 from "@/components/Auth/AuthWrapper1";

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

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const { trigger, isMutating, error } = useSWRMutation(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/feedback`,
    sendRequest
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await trigger(formData);
      setSnackbarMessage("Support request submitted successfully!");
      setSnackbarOpen(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setSnackbarMessage("Failed to submit support request. Please try again.");
      setSnackbarOpen(true);
    }
  };

  return (
    <AuthWrapper1>
      <Box component={Paper} p={3}>
        <Container>
          <Typography variant="h1" gutterBottom className="text-orange-50">
            Get in touch
          </Typography>
          <Typography variant="h6" gutterBottom className="text-orange-50">
            We'd love to hear from you speak to us
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  variant="outlined"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Subject"
                  variant="outlined"
                  required
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Message"
                  variant="outlined"
                  multiline
                  rows={4}
                  required
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  type="submit"
                  className="bg-orange-50 text-white"
                  disabled={isMutating}
                >
                  {isMutating ? <CircularProgress size={24} /> : "Submit"}
                </Button>
              </Grid>
            </Grid>
          </form>
          {error && (
            <Typography color="error" mt={2}>
              An error occurred. Please try again.
            </Typography>
          )}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
            message={snackbarMessage}
          />
        </Container>
      </Box>
    </AuthWrapper1>
  );
};

export default ContactForm;
