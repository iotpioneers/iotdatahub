import React from "react";

// Project imports
import { Metadata } from "next";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IoTDataHub - Admin - Dashboard",
  description: "Welcome to the IoTDataHub admin dashboard",
};
