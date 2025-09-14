import type React from "react";
import type { Metadata } from "next";
import "../globals.css";
import ClientRootLayout from "../ClientRootLayout";
import HydrationFix from "@/components/HydrationFix";
import CollaborationProvider from "../CollaborationProvider";
import { LoadingProvider } from "@/components/ui/unified-loading";
import LayoutContent from "@/components/LayoutContent";

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
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen overflow-hidden" suppressHydrationWarning>
        <ClientRootLayout>
          <LoadingProvider>
            <CollaborationProvider>
              <HydrationFix>
                <LayoutContent>{children}</LayoutContent>
              </HydrationFix>
            </CollaborationProvider>
          </LoadingProvider>
        </ClientRootLayout>
      </body>
    </html>
  );
}
