"use client";

import * as React from "react";
import SearchSection from "./Header/SearchSection";
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

  if (status === "unauthenticated") router.push("/login");

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
          <h1 className="text-2xl text-start cursor-pointer font-bold text-blue-900">
            <Link href="/">
              <span className="hover:text-zinc-950">IoTDataHub</span>
            </Link>
          </h1>
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

      {/* header search */}
      <SearchSection />
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />

      {/* notification & profile */}
      <NotificationSection />
      <ProfileSection />
    </>
  );
};

export default Navbar;
