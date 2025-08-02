import React from "react";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import "../globals.css";
import ClientRootLayout from "../ClientRootLayout";
import Navbar from "@/components/dashboard/Navbar";
import HydrationFix from "@/components/HydrationFix";
import CollaborationProvider from "../CollaborationProvider";
import { Theme } from "@radix-ui/themes";
import { ToastProvider } from "@/components/ui/toast-provider";

const Sidebar = dynamic(() => import("@/components/sidebar/SideNavbar"), {
  loading: () => (
    <aside className="h-screen bg-white dark:bg-gray-800 shadow-md w-64 flex-shrink-0">
      <div className="flex flex-col h-full">
        {/* Loading skeleton */}
        <div className="p-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <nav className="flex-1 overflow-y-auto p-2 space-y-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
            />
          ))}
        </nav>
      </div>
    </aside>
  ),
});

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
      <body className="h-screen overflow-hidden" suppressHydrationWarning>
        <ClientRootLayout>
          <CollaborationProvider>
            <HydrationFix>
              <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
                {/* Sidebar - Fixed width, full height */}
                <Sidebar />

                {/* Main content area */}
                <div className="flex-1 flex flex-col min-w-0">
                  {/* Navbar - Fixed height */}
                  <div className="flex-shrink-0">
                    <Navbar />
                  </div>

                  {/* Scrollable content area */}
                  <Theme>
                    <main className="bg-gray-200 p-2 w-full h-full min-h-screen">
                      <ToastProvider>{children}</ToastProvider>
                    </main>
                  </Theme>
                </div>
              </div>
            </HydrationFix>
          </CollaborationProvider>
        </ClientRootLayout>
      </body>
    </html>
  );
}
