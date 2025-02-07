"use client";

import React, { useState } from "react";

// material-ui
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Fade,
  Grid,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";

// assets
import { Building2, User } from "lucide-react";

// project imports
import AuthRegister from "../authentication/auth-forms/AuthRegister";
import AuthWrapper1 from "../AuthWrapper1";
import AuthEnterpriseRegister from "./AuthEnterpriseRegister";

// Types
type AccountType = "personal" | "enterprise";

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error";
}

const RegistrationFlowComponent: React.FC = () => {
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const AccountTypeSelection = () => {
    const personalCardBg = "rgba(25, 118, 210, 0.05)";
    const enterpriseCardBg = "rgba(46, 125, 50, 0.05)";

    return (
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12}>
          <Fade in timeout={800}>
            <Grid
              container
              direction={{ xs: "column-reverse", md: "row" }}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item>
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  spacing={1}
                  className="relative"
                >
                  <Typography
                    color="secondary.main"
                    gutterBottom
                    variant="h3"
                    className="animate-fadeIn"
                    sx={{
                      position: "relative",
                      "&:after": {
                        content: '""',
                        position: "absolute",
                        bottom: "-8px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "60px",
                        height: "3px",
                        backgroundColor: "secondary.main",
                        borderRadius: "2px",
                      },
                    }}
                  >
                    Get Started with IoT Data Hub
                  </Typography>
                  <Typography
                    variant="caption"
                    fontSize="14px"
                    textAlign={{ xs: "center", md: "inherit" }}
                    sx={{ opacity: 0.87 }}
                  >
                    How will you use IoT Data Hub to achieve your goals?
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Fade>
        </Grid>

        <Grid item xs={12} pt={3}>
          <Divider sx={{ opacity: 0.5 }} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Fade in timeout={500}>
            <Card
              onClick={() => setAccountType("personal")}
              sx={{
                height: "16rem",
                cursor: "pointer",
                backgroundColor: personalCardBg,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow:
                    "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                  backgroundColor: "rgba(25, 118, 210, 0.1)",
                  "& .icon-container": {
                    transform: "scale(1.1)",
                  },
                  "& .card-title": {
                    color: "primary.main",
                  },
                },
              }}
            >
              <CardContent
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  "&:after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: "3px",
                    backgroundColor: "primary.main",
                    transition: "width 0.3s ease",
                  },
                  "&:hover:after": {
                    width: "80%",
                  },
                }}
              >
                <Stack
                  spacing={3}
                  alignItems="center"
                  justifyContent="center"
                  className="h-full"
                >
                  <Box
                    className="icon-container"
                    sx={{
                      transition: "transform 0.3s ease",
                      p: 2,
                      borderRadius: "50%",
                      backgroundColor: "rgba(25, 118, 210, 0.1)",
                    }}
                  >
                    <User size={48} color="#1976d2" />
                  </Box>
                  <Typography
                    variant="h5"
                    className="card-title"
                    sx={{ transition: "color 0.3s ease" }}
                  >
                    Personal Account
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                    sx={{ maxWidth: "80%" }}
                  >
                    For individual users managing personal IoT devices
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        <Grid item xs={12} md={6}>
          <Fade in timeout={500} style={{ transitionDelay: "150ms" }}>
            <Card
              onClick={() => setAccountType("enterprise")}
              sx={{
                height: "16rem",
                cursor: "pointer",
                backgroundColor: enterpriseCardBg,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow:
                    "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                  backgroundColor: "rgba(46, 125, 50, 0.1)",
                  "& .icon-container": {
                    transform: "scale(1.1)",
                  },
                  "& .card-title": {
                    color: "success.main",
                  },
                },
              }}
            >
              <CardContent
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  "&:after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: "3px",
                    backgroundColor: "success.main",
                    transition: "width 0.3s ease",
                  },
                  "&:hover:after": {
                    width: "80%",
                  },
                }}
              >
                <Stack
                  spacing={3}
                  alignItems="center"
                  justifyContent="center"
                  className="h-full"
                >
                  <Box
                    className="icon-container"
                    sx={{
                      transition: "transform 0.3s ease",
                      p: 2,
                      borderRadius: "50%",
                      backgroundColor: "rgba(46, 125, 50, 0.1)",
                    }}
                  >
                    <Building2 size={48} color="#2e7d32" />
                  </Box>
                  <Typography
                    variant="h5"
                    className="card-title"
                    sx={{ transition: "color 0.3s ease" }}
                  >
                    Enterprise Account
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                    sx={{ maxWidth: "80%" }}
                  >
                    For organizations managing multiple IoT devices and users
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      </Grid>
    );
  };

  const renderContent = () => {
    if (!accountType) {
      return <AccountTypeSelection />;
    }

    if (accountType === "personal") {
      return <AuthRegister />;
    }

    return <AuthEnterpriseRegister />;
  };

  return (
    <AuthWrapper1>
      <Grid
        container
        direction="column"
        justifyContent="flex-end"
        sx={{ minHeight: "100vh" }}
      >
        <Grid item xs={12}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ minHeight: "calc(100vh - 68px)" }}
          >
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <Box className="max-w-4xl mx-auto p-6">{renderContent()}</Box>
            </Grid>
          </Grid>
        </Grid>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={12000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Grid>
    </AuthWrapper1>
  );
};

export default RegistrationFlowComponent;
