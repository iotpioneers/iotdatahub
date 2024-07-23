"use client";

import React from "react";

// third party
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { useSelector } from "react-redux";
import { Theme } from "@radix-ui/themes";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, StyledEngineProvider } from "@mui/material";

// project imports

import AuthProvider from "@/app/auth/Provider";
import QueryClientProvider from "@/app/QueryClientProvider";
import { UserProvider } from "@/contexts/user-context";
import { LocalizationProvider } from "@/components/core/localization-provider";
import reducer from "@/app/store/reducer";

// google-fonts
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/700.css";

import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

// defaultTheme
import themes from "@/app/themes";

// style + assets
import "@/app/styles/scss/style.scss";
const store = configureStore({ reducer });

// Infer the type of store
export type AppStore = typeof store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const customization = useSelector.withTypes<RootState>();

  return (
    <Provider store={store}>
      <QueryClientProvider>
        <AuthProvider>
          <UserProvider>
            <LocalizationProvider>
              <StyledEngineProvider injectFirst>
                <ThemeProvider theme={themes(customization)}>
                  <CssBaseline />
                  <Theme>{children}</Theme>
                </ThemeProvider>
              </StyledEngineProvider>
            </LocalizationProvider>
          </UserProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  );
}
