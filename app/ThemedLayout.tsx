"use client";

import React from "react";
import { useSelector } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import { Theme } from "@radix-ui/themes";
import { ClientSideSuspense } from "@liveblocks/react/suspense";
import LoadingProgressBar from "@/components/LoadingProgressBar";
import themes from "@/app/themes";
import { store } from "./ClientRootLayout";

// Infer the type of store
type AppStore = typeof store;

// Infer the `RootState` and `AppDispatch` types from the store itself
type RootState = ReturnType<AppStore["getState"]>;

const ThemedLayout = ({ children }: { children: React.ReactNode }) => {
  const customization = useSelector((state: RootState) => ({
    borderRadius: state.customization.borderRadius,
    fontFamily: state.customization.fontFamily,
    navType: state.customization.navType,
  }));

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <Theme>
          <ClientSideSuspense fallback={<LoadingProgressBar />}>
            {children}
          </ClientSideSuspense>
        </Theme>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default ThemedLayout;
