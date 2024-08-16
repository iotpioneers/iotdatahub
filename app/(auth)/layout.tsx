import React from "react";

// Project imports
import ClientRootLayout from "@/app/ClientRootLayout";
import { Metadata } from "next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientRootLayout>
          <main>{children}</main>
        </ClientRootLayout>
      </body>
    </html>
  );
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "IoTDataHub - Auth",
  description: "Signin to your account or create a new account",
};
