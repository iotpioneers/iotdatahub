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
      <body className="h-screen w-screen overflow-hidden">
        <ClientRootLayout>
          <CollaborationProvider>
            <DashboardNavigation />
            <div className="flex flex-col flex-grow lg:ml-44 xs:mx-2 mt-12 h-[calc(100vh-6rem)] overflow-hidden">
              <Container className="h-full overflow-hidden">
                <div className="h-full overflow-auto">{children}</div>
              </Container>
            </div>
          </CollaborationProvider>
        </ClientRootLayout>
      </body>
    </html>
  );
}
