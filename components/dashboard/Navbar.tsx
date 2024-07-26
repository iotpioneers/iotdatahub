"use client";

import * as React from "react";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { Bell as BellIcon } from "@phosphor-icons/react/dist/ssr/Bell";

import { UsePopover } from "@/hooks/usePopover";

import { UserPopover } from "./layout/userPopover";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Avatar } from "@mui/material";

const Navbar = () => {
  const { status, data: session } = useSession();
  console.log("session", session);
  const userPopover = UsePopover<HTMLDivElement>();

  const router = useRouter();

  if (status === "unauthenticated") router.push("/login");

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          borderBottom: "1px solid var(--mui-palette-divider)",
          backgroundColor: "var(--mui-palette-background-paper)",
          position: "sticky",
          top: 0,
          zIndex: "var(--mui-zIndex-appBar)",
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: "64px",
            px: 2,
          }}
        >
          <Stack sx={{ alignItems: "center" }} direction="row" spacing={2}>
            <h1 className="flex lg:hidden text-base text-center justify-center cursor-pointer font-bold text-blue-900 border-gray-100 w-full">
              <Link href="/" className="flex justify-center items-center gap-1">
                <img
                  src="logo.svg"
                  alt="logo"
                  className="h-6 w-6 text-gray-10"
                />
                <span className="hover:text-zinc-950">IoTDataCenter</span>
              </Link>
            </h1>
          </Stack>
          <Stack sx={{ alignItems: "center" }} direction="row" spacing={2}>
            <Tooltip title="Notifications">
              <Badge badgeContent={4} color="success" variant="standard">
                <IconButton>
                  <BellIcon />
                </IconButton>
              </Badge>
            </Tooltip>
            {status === "authenticated" && (
              <Avatar
                onClick={userPopover.handleOpen}
                ref={userPopover.anchorRef}
                sx={{ cursor: "pointer" }}
              >
                <img
                  onClick={userPopover.handleOpen}
                  src={session!.user!.image || "/user.svg"}
                  alt="Profile"
                  className="rounded-full"
                />
              </Avatar>
            )}
          </Stack>
        </Stack>
      </Box>
      <UserPopover
        anchorEl={userPopover.anchorRef.current}
        onClose={userPopover.handleClose}
        open={userPopover.open}
      />
    </React.Fragment>
  );
};

export default Navbar;
