"use client";

import * as React from "react";
import NotificationSection from "./Header/NotificationSection";
import ProfileSection from "./Header/ProfileSection";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// material-ui
import { useTheme } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Tooltip from "@mui/material/Tooltip";

// assets
import { IconMenu2 } from "@tabler/icons-react";
import Logo from "../Home/Logo";

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Navbar = ({
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}) => {
  const { status } = useSession();
  const theme = useTheme();

  const router = useRouter();

  if (status !== "loading" && status === "unauthenticated") return null;

  return (
    <>
      {/* logo & toggler button */}
      <Box
        sx={{
          width: 228,

          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
          [theme.breakpoints.down("md")]: {
            width: "auto",
          },
        }}
      >
        <Box component="span" sx={{ display: "block", mr: 2, flexGrow: 1 }}>
          <Logo />
        </Box>
        <ButtonBase
          sx={{
            borderRadius: "8px",
            display: { xs: "flex", lg: "none" },
            overflow: "hidden",
          }}
        >
          <Tooltip title="Toggle Menu">
            <Avatar
              variant="rounded"
              sx={{
                ...theme.typography.commonAvatar,
                ...theme.typography.mediumAvatar,
                transition: "all .2s ease-in-out",
                background: theme.palette.secondary.light,
                color: theme.palette.secondary.dark,
                "&:hover": {
                  background: theme.palette.secondary.dark,
                  color: theme.palette.secondary.light,
                },
              }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              color="inherit"
            >
              <IconMenu2 stroke={1.5} size="1.3rem" />
            </Avatar>
          </Tooltip>
        </ButtonBase>
      </Box>

      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />

      {/* notification & profile */}
      <NotificationSection />
      <ProfileSection />
    </>
  );
};

export default Navbar;
