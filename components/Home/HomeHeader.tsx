"use client";

import * as React from "react";
import { useSession } from "next-auth/react";

// Material UI
import { Link, PaletteMode } from "@mui/material";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";

// Project imports
import ToggleColorMode from "./LandingPage/ToggleColorMode";
import NavigationMenuLinks from "./NavigationMenuLinks/NavigationMenuLinks";
import { navigation } from "@/constants";
import AngledButton from "./components/design/AngledButton";
import MenuSvg from "./components/design/svg/MenuSvg";
import LoadingProgressBar from "../LoadingProgressBar";
import Logo from "./Logo";

const logoStyle = {
  width: "140px",
  height: "auto",
  cursor: "pointer",
};

interface AppAppBarProps {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

const HomeHeader = ({ mode, toggleColorMode }: AppAppBarProps) => {
  const [openNavigation, setOpenNavigation] = React.useState(false);

  const { status } = useSession();

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
    } else {
      setOpenNavigation(true);
    }
  };

  return (
    <div>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: "transparent",
          backgroundImage: "none",
          mt: 2,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            variant="regular"
            sx={(theme) => ({
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
              borderRadius: "999px",
              bgcolor:
                theme.palette.mode === "light"
                  ? "rgba(255, 255, 255, 0.4)"
                  : "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(24px)",
              maxHeight: 40,
              border: "1px solid",
              borderColor: "divider",
              boxShadow:
                theme.palette.mode === "light"
                  ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                  : "0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)",
            })}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                ml: "-18px",
                px: 0,
              }}
            >
              <Logo />
              <Box
                sx={{
                  display: { xs: "none", md: "flex", marginLeft: "10rem" },
                }}
              >
                <NavigationMenuLinks />
              </Box>
            </Box>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 0.5,
                alignItems: "center",
              }}
            >
              <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
              {status !== "loading" && (
                <Button
                  className="flex  xs:mr-1 text-orange-50"
                  href={status === "authenticated" ? "/dashboard" : "/login"}
                >
                  {status === "authenticated" ? "DASHBOARD" : "SIGN IN"}
                </Button>
              )}
            </Box>
            <Box sx={{ display: { sm: "", md: "none" } }}>
              <AngledButton
                className="ml-1 lg:hidden"
                px="px-3"
                onClick={toggleNavigation}
              >
                <MenuSvg openNavigation={openNavigation} />
              </AngledButton>
              <Drawer anchor="right" open={openNavigation} sx={{ mt: 12 }}>
                <Box
                  sx={{
                    minWidth: "60dvw",
                    p: 2,
                    backgroundColor: "background.paper",
                    flexGrow: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <AngledButton
                      className="ml-1 lg:hidden"
                      px="px-3"
                      onClick={toggleNavigation}
                    >
                      <MenuSvg openNavigation={openNavigation} />
                    </AngledButton>
                    <ToggleColorMode
                      mode={mode}
                      toggleColorMode={toggleColorMode}
                    />
                  </Box>
                  {navigation.map((item) => (
                    <Link
                      key={item.id}
                      href={item.url}
                      onClick={() => setOpenNavigation(false)}
                      className={`lg:hidden block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 px-6 py-2`}
                    >
                      <MenuItem
                        onClick={() => setOpenNavigation(false)}
                        className="text-orange-50"
                      >
                        {item.title}
                      </MenuItem>
                    </Link>
                  ))}
                  <Divider />
                  {status === "loading" && <LoadingProgressBar />}
                  {status !== "loading" && (
                    <AngledButton
                      className="grid text-orange-50 mt-2"
                      href={
                        status === "authenticated" ? "/dashboard" : "/login"
                      }
                    >
                      {status === "authenticated" ? "DASHBOARD" : "SIGN IN"}
                    </AngledButton>
                  )}
                </Box>
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
};

export default HomeHeader;
