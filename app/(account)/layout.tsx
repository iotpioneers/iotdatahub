import React from "react";
import { Metadata } from "next";
import ClientRootLayout from "@/app/ClientRootLayout";
import "../globals.css";
import { Container } from "@radix-ui/themes";

import CollaborationProvider from "../CollaborationProvider";
import DashboardNavigation from "@/components/dashboard/DashboardNavigation";

export const metadata: Metadata = {
  title: "IoTDataHub - Dashboard",
  description:
    "Manage your IoT devices with ease. Our IoT Plug and Play solutions empower businesses to seamlessly connect, manage, and optimize their IoT devices, enabling a smarter and more connected world.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientRootLayout>
          <CollaborationProvider>
            <DashboardNavigation />
            <div className="flex flex-col flex-grow lg:ml-64 xs:mx-2 mt-24">
              <Container>{children}</Container>
            </div>
          </CollaborationProvider>
        </ClientRootLayout>
      </body>
    </html>
  );
}
