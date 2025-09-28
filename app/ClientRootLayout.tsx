"use client";

import React from "react";

// third party
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

// project imports

import AuthProvider from "@/app/auth/AuthProvider";
import reducer from "@/app/store/reducer";
import QueryClientProvider from "@/app/QueryClientProvider";
import { LocalizationProvider } from "@/components/core/localization-provider";
import ThemedLayout from "./ThemedLayout";

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

// style + assets
import "@/app/styles/scss/style.scss";
import { GlobalStateProvider } from "@/context/globalContext";

export const store = configureStore({ reducer });

const ClientRootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <QueryClientProvider>
        <AuthProvider>
          <LocalizationProvider>
            <ThemedLayout>
              <GlobalStateProvider>{children}</GlobalStateProvider>
            </ThemedLayout>
          </LocalizationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default ClientRootLayout;
