"use client";

import React from "react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { TypeAnimation } from "react-type-animation";

// material-ui
import { useTheme } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

// project imports
import MainCard from "../cards/MainCard";

// assets
import HailOutlinedIcon from "@mui/icons-material/HailOutlined";

// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

// Greeting function
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 18) return "Good Afternoon";
  return "Good Evening";
};

// Array of welcome messages
const welcomeMessages = [
  "Welcome to your personalized IoT Data Hub dashboard. Here, you can manage your devices, monitor data, and stay connected.",
  "Explore your IoT ecosystem with ease. Monitor, manage, and optimize your connected devices all in one place.",
  "Your gateway to the world of IoT. Dive into real-time data, device management, and intelligent insights.",
  "Unleash the power of your IoT network. Streamline operations, enhance efficiency, and make data-driven decisions.",
];

const WelcomeContentCard = () => {
  const theme = useTheme();

  const { status, data: session } = useSession();

  if (status !== "loading" && status === "unauthenticated") {
    return redirect("/login");
  }

  // Create the sequence for TypeAnimation
  const welcomeSequence = welcomeMessages.flatMap((message) => [message, 3000]);

  return (
    <>
      <MainCard
        border={false}
        content={false}
        sx={{
          bgcolor: "orange.main",
          color: "#fff",
          overflow: "hidden",
          position: "relative",
          "&:after": {
            content: '""',
            position: "absolute",
            width: 210,
            height: 210,
            background: theme.palette.secondary[800],
            borderRadius: "50%",
            top: { xs: -105, sm: -85 },
            right: { xs: -140, sm: -95 },
          },
          "&:before": {
            content: '""',
            position: "absolute",
            width: 210,
            height: 210,
            background: theme.palette.secondary[800],
            borderRadius: "50%",
            top: { xs: -155, sm: -125 },
            right: { xs: -70, sm: -15 },
            opacity: 0.5,
          },
        }}
      >
        <Box sx={{ p: 2.25 }}>
          <Grid container direction="column">
            <Grid item>
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Avatar
                    variant="rounded"
                    sx={{
                      ...theme.typography.commonAvatar,
                      ...theme.typography.largeAvatar,
                      bgcolor: "secondary.800",
                      mt: 1,
                    }}
                  >
                    <HailOutlinedIcon fontSize="inherit" />
                  </Avatar>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container alignItems="center">
                <Grid item>
                  <Typography
                    sx={{
                      fontSize: "2.125rem",
                      fontWeight: 500,
                      mr: 1,
                      mt: 1.75,
                      mb: 0.75,
                    }}
                  >
                    <TypeAnimation
                      sequence={[
                        `${getGreeting()} ${
                          session?.user?.name?.split(" ")[0] || ""
                        }`,
                        1000,
                      ]}
                      wrapper="span"
                      speed={50}
                      repeat={1}
                    />
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item sx={{ mb: 1.25 }}>
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: "grey.700",
                }}
              >
                <TypeAnimation
                  sequence={welcomeSequence}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                />
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </MainCard>
    </>
  );
};

export default WelcomeContentCard;
