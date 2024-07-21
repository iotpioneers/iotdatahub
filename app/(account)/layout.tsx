import React from "react";
import { Metadata } from "next";
import "../globals.css";
import DashboardNavigation from "@/components/Dashboard/DashboardNavigation";
import AuthProvider from "../auth/Provider";
import QueryClientProvider from "../QueryClientProvider";
import { UserProvider } from "@/contexts/user-context";
import { LocalizationProvider } from "@/components/core/localization-provider";
import { Container } from "@radix-ui/themes";

export const metadata: Metadata = {
  title: "ARTISAN",
  description:
    "Your one-stop destination for seamless and efficient IoT Plug and Play services. Our cutting-edge solutions empower businesses to effortlessly connect, manage, and optimize their IoT devices, enabling a smarter and more connected world.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider>
          <AuthProvider>
            <UserProvider>
              <LocalizationProvider>
                <DashboardNavigation />
                <div className="flex flex-col flex-gro lg:ml-64 xs:mx-2">
                  <Container>{children}</Container>
                </div>
              </LocalizationProvider>
            </UserProvider>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
