"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import SearchSection from "./Header/SearchSection";
import NotificationSection from "./Header/NotificationSection";
import ProfileSection from "./Header/ProfileSection";

import { UsePopover } from "@/hooks/usePopover";

import { UserPopover } from "./layout/userPopover";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { status } = useSession();
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
                <span className="hover:text-zinc-950">IoTDataHub</span>
              </Link>
            </h1>
          </Stack>
          <Stack sx={{ alignItems: "center" }} direction="row" spacing={2}>
            <SearchSection />
            <NotificationSection />
            {status === "authenticated" && <ProfileSection />}
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
