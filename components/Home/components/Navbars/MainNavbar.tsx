"use client";

import {
  AppBar,
  Container,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { ReactNode } from "react";
import { NAVBAR_HEIGHT } from "@/constants";
import useScrollPosition from "@/hooks/useScrollPosition";
import LanguageIcon from "@mui/icons-material/Language";

import Link from "next/link";
import NavigationMenuLinks from "../../NavigationMenuLinks/NavigationMenuLinks";
import AvatarIcon from "../../AvatarIcon";
import MenuBar from "@/components/MenuBar";

interface LinkButtonProps {
  children: ReactNode;
  [key: string]: any;
}

const LinkButton: React.FC<LinkButtonProps> = ({ children, ...props }) => (
  <Stack
    direction="row"
    alignItems="center"
    spacing={0.2}
    sx={{
      cursor: "pointer",
      color: "text.secondary",
      "&:hover": { color: "text.primary" },
    }}
    {...props}
  >
    {children}
  </Stack>
);

const Navbar = () => {
  const scrollPosition = useScrollPosition();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <AppBar
      elevation={0}
      sx={{
        py: 1,
        height: NAVBAR_HEIGHT,
        bgcolor: scrollPosition > 10 ? "rgba(7,7,16,.7)" : "transparent",
        backdropFilter: scrollPosition > 10 ? "blur(60px)" : undefined,
      }}
    >
      <Container
        sx={{
          [theme.breakpoints.up("lg")]: {
            maxWidth: "1380px!important",
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="home_assets/logo.svg"
              style={{ height: "100%", objectFit: "contain" }}
            />
            <Typography style={{ height: "100%" }}>Ten2Ten</Typography>
          </Link>

          {/* Links */}
          {!isMobile && (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={6}
              sx={{ flex: 1 }}
              flexWrap="wrap"
            >
              <NavigationMenuLinks />
            </Stack>
          )}

          {/* Action Buttons */}
          {isMobile ? (
            <MenuBar />
          ) : (
            <Stack direction="row" spacing={5} alignItems="center">
              <LinkButton spacing={1}>
                <LanguageIcon fontSize="small" />
                <Typography variant="body2">EN</Typography>
              </LinkButton>

              <AvatarIcon />

              {/* <LaunchButton sx={{ borderRadius: 3 }} /> */}
            </Stack>
          )}
        </Stack>
      </Container>
    </AppBar>
  );
};

export default Navbar;
