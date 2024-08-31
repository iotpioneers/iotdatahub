import React from "react";
import { Metadata } from "next";
import ClientRootLayout from "@/app/ClientRootLayout";

import AdminRootLayout from "@/components/Admin/components/AdminRootLayout";

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
          <AdminRootLayout>{children}</AdminRootLayout>
        </ClientRootLayout>
      </body>
    </html>
  );
}
