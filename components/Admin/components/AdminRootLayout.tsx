"use client";

import * as React from "react";
import { createTheme, ThemeProvider, alpha } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import getDashboardTheme from "@/components/Admin/theme/getDashboardTheme";
import AppNavbar from "@/components/Admin/components/AppNavbar";
import Header from "@/components/Admin/components/Header";
import SideMenu from "@/components/Admin/components/SideMenu";
import NavBar from "@/components/Admin/NavBar";
import { useSession } from "next-auth/react";
import LoadingProgressBar from "@/components/LoadingProgressBar";

interface AdminRootLayoutProps {
  children: React.ReactNode;
}

const AdminRootLayout: React.FC<AdminRootLayoutProps> = ({ children }) => {
  const [mode, setMode] = React.useState<PaletteMode>("light");
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const dashboardTheme = createTheme(getDashboardTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });

  React.useEffect(() => {
    const savedMode = localStorage.getItem("themeMode") as PaletteMode | null;
    if (savedMode) {
      setMode(savedMode);
    } else {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setMode(systemPrefersDark ? "dark" : "light");
    }
  }, []);

  const toggleColorMode = () => {
    const newMode = mode === "dark" ? "light" : "dark";
    setMode(newMode);
    localStorage.setItem("themeMode", newMode);
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };

  const { status, data: session } = useSession();

  if (
    (status !== "loading" && status === "unauthenticated") ||
    !session ||
    !session.user ||
    session.user.role !== "ADMIN"
  ) {
    return null;
  }
  return (
    <ThemeProvider theme={showCustomTheme ? dashboardTheme : defaultTheme}>
      <CssBaseline />
      <NavBar
        toggleCustomTheme={toggleCustomTheme}
        showCustomTheme={showCustomTheme}
        mode={mode}
        toggleColorMode={toggleColorMode}
      />
      <Box sx={{ display: "flex" }}>
        <SideMenu />
        <AppNavbar />
        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            position: { sm: "relative", md: "" },
            top: { sm: "48px", md: "60px" },
            height: { sm: "calc(100vh - 48px)", md: "100vh" },
            flexGrow: 1,
            backgroundColor: alpha(theme.palette.background.default, 1),
            overflow: "auto",
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              mx: 3,
              pb: 10,
              mt: { xs: 16, sm: 10, md: 0 },
            }}
          >
            <Header />
            {children}
          </Stack>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminRootLayout;
