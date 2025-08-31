"use client";

import React from "react";
import { useSelector } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import themes from "@/app/themes";
import { store } from "./ClientRootLayout";
import { createSelector } from "@reduxjs/toolkit";

type RootState = ReturnType<typeof store.getState>;

// Create memoized selectors
const selectBorderRadius = (state: RootState) =>
  state.customization.borderRadius;
const selectFontFamily = (state: RootState) => state.customization.fontFamily;
const selectNavType = (state: RootState) => state.customization.navType;

const selectCustomization = createSelector(
  [selectBorderRadius, selectFontFamily, selectNavType],
  (borderRadius, fontFamily, navType) => ({
    borderRadius,
    fontFamily,
    navType,
  }),
);

const ThemedLayout = ({ children }: { children: React.ReactNode }) => {
  const customization = useSelector(selectCustomization);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default ThemedLayout;
