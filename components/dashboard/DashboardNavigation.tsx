"use client";

import React, { useState } from "react";
import Navbar from "@/components/dashboard/Navbar";
import SideNavbar from "@/components/sidebar/SideNavbar";

// material-ui
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

// project imports
import { CssBaseline, useTheme } from "@mui/material";

// ==============================|| MAIN LAYOUT ||============================== //

const DashboardNavigation = () => {
  const theme = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* header */}
      <AppBar
        enableColorOnDark
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          bgcolor: theme.palette.background.default,
        }}
      >
        <Toolbar>
          <Navbar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </Toolbar>
      </AppBar>

      {/* drawer */}
      <SideNavbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
    </Box>
  );
};

export default DashboardNavigation;
