"use client";

import React from "react";
import { useState } from "react";
import "../globals.css";

// MUI imports
import { PaletteMode } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Project imports
import ClientRootLayout from "@/app/ClientRootLayout";
import HomeHeader from "@/components/Home/HomeHeader";
import getLPTheme from "@/app/themes/getLPTheme";
import Footer from "@/components/Home/components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<PaletteMode>("light");
  const LPtheme = createTheme(getLPTheme(mode));

  const toggleColorMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <html lang="en">
      <body>
        <ClientRootLayout>
          <ThemeProvider theme={LPtheme}>
            <CssBaseline />
            <HomeHeader mode={mode} toggleColorMode={toggleColorMode} />
            <main>{children}</main>
            <Footer />
          </ThemeProvider>
        </ClientRootLayout>
      </body>
    </html>
  );
}
