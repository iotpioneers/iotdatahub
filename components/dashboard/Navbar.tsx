"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import SearchSection from "./Header/SearchSection";
import NotificationSection from "./Header/NotificationSection";
import ProfileSection from "./Header/ProfileSection";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { status } = useSession();

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
            <Link href="/" className="flex justify-center items-center gap-1">
              <h1 className="flex lg:hidden text-2xl text-center justify-center cursor-pointer font-bold text-blue-900 border-gray-100 w-full">
                <span className="hover:text-zinc-950">IoTDataHub</span>
              </h1>
            </Link>
            <SearchSection />
          </Stack>
          <Stack sx={{ alignItems: "center" }} direction="row" spacing={2}>
            <NotificationSection />
            {status === "authenticated" && <ProfileSection />}
          </Stack>
        </Stack>
      </Box>
    </React.Fragment>
  );
};

export default Navbar;
