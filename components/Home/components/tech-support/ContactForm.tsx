"use client";

import React, { useState } from "react";
import useSWRMutation from "swr/mutation";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Snackbar,
  Alert,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  styled,
  FormControl,
  FormHelperText,
  OutlinedInput,
  InputLabel,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Send as SendIcon,
  WhatsApp as WhatsAppIcon,
} from "@mui/icons-material";

// Types
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactInfo {
  icon: React.ReactNode;
  title: string;
  content: string;
  color: string;
  action?: {
    label: string;
    url: string;
  };
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error";
}

// API mutation function
const sendRequest = async (url: string, { arg }: { arg: ContactFormData }) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return response.json();
};

// Styled Components
const StyledContactCard = styled(Card)(({ theme }) => ({
  height: "100%",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[8],
  },
  display: "flex",
  flexDirection: "column",
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  borderRadius: "50%",
  padding: theme.spacing(2),
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}));

// Google Maps Component
const MapComponent: React.FC = () => {
  return (
    <Box
      component="iframe"
      sx={{
        border: 0,
        width: "100%",
        height: "400px",
        borderRadius: 1,
      }}
      src="https://maps.google.com/maps?width=100%&height=400&hl=en&q=-1.9685361344519234,30.098472851807898&ie=UTF8&t=&z=14&iwloc=B&output=embed"
      title="Location Map"
      loading="lazy"
    />
  );
};

const ContactForm: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  // Initialize SWR mutation
  const { trigger, isMutating } = useSWRMutation(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/feedback`,
    sendRequest
  );

  const contactInfo: ContactInfo[] = [
    {
      icon: <WhatsAppIcon />,
      title: "WhatsApp",
      content: "+(250) 791-377-302",
      color: theme.palette.success.light,
      action: {
        label: "Chat on WhatsApp",
        url: "https://wa.me/250791377302",
      },
    },
    {
      icon: <EmailIcon />,
      title: "Email",
      content: "datahubiot@gmail.com",
      color: theme.palette.secondary.light,
      action: {
        label: "Send Email",
        url: "mailto:datahubiot@gmail.com",
      },
    },
    {
      icon: <LocationIcon />,
      title: "Address",
      content: "KK 15 Rd, Kigali",
      color: theme.palette.primary.light,
      action: {
        label: "View on Maps",
        url: "https://maps.google.com/?q=-1.9685361344519234,30.098472851807898",
      },
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<ContactFormData> = {};

    // Validation
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await trigger(formData);

      setSnackbar({
        open: true,
        message: "Message sent successfully!",
        severity: "success",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setErrors({});
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to send message. Please try again.",
        severity: "error",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Header Section */}
      <Box textAlign="center" mb={6}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          className="text-orange-50"
        >
          Get in Touch
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" mb={4}>
          Choose your preferred way to connect with us
        </Typography>
      </Box>

      {/* Contact Info Cards with Actions */}
      <Grid container spacing={3} mb={6}>
        {contactInfo.map((info, index) => (
          <Grid item xs={12} md={4} key={index}>
            <StyledContactCard>
              <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
                <IconWrapper sx={{ bgcolor: info.color, margin: "auto" }}>
                  {info.icon}
                </IconWrapper>
                <Typography
                  variant="h6"
                  gutterBottom
                  className="text-orange-50"
                >
                  {info.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {info.content}
                </Typography>
                {info.action && (
                  <Button
                    variant="outlined"
                    color="primary"
                    href={info.action.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={info.icon}
                    sx={{ mt: 2 }}
                  >
                    {info.action.label}
                  </Button>
                )}
              </CardContent>
            </StyledContactCard>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Or Send Us a Message
        </Typography>
      </Divider>

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* Contact Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.name}>
                    <InputLabel htmlFor="name">Name</InputLabel>
                    <OutlinedInput
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      label="Name"
                    />
                    {errors.name && (
                      <FormHelperText>{errors.name}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.email}>
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <OutlinedInput
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      label="Email"
                    />
                    {errors.email && (
                      <FormHelperText>{errors.email}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.subject}>
                    <InputLabel htmlFor="subject">Subject</InputLabel>
                    <OutlinedInput
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      label="Subject"
                    />
                    {errors.subject && (
                      <FormHelperText>{errors.subject}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.message}>
                    <InputLabel htmlFor="message">Message</InputLabel>
                    <OutlinedInput
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      label="Message"
                      multiline
                      rows={4}
                    />
                    {errors.message && (
                      <FormHelperText>{errors.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    endIcon={!isMutating && <SendIcon />}
                    fullWidth={isMobile}
                    disabled={isMutating}
                  >
                    {isMutating ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* Map Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ pl: 2 }}>
              Our Location
            </Typography>
            <MapComponent />
          </Paper>
        </Grid>
      </Grid>

      {/* Snackbar for form submission feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ContactForm;
