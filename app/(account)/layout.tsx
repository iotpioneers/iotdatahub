import React from "react";
import { Metadata } from "next";
import "../globals.css";
import { Container } from "@radix-ui/themes";
import DashboardNavigation from "@/components/Dashboard/DashboardNavigation";
import AuthProvider from "../auth/Provider";
import QueryClientProvider from "../QueryClientProvider";

export const metadata: Metadata = {
  title: "Ten2Ten",
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
      <body className="bg-white">
        <QueryClientProvider>
          <AuthProvider>
            <DashboardNavigation />
            <div className="flex flex-col flex-gro lg:ml-64 xs:mx-2">
              <Container>{children}</Container>
            </div>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
