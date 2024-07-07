"use client";

import "@radix-ui/themes/styles.css";
import Navbar from "@/components/dashboard/Navbar";
import { Theme } from "@radix-ui/themes";
import useMediaQuery from "@/hooks/useMediaQuery";
import SideNavbar from "@/components/sidebar/SideNavbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isSmallScreens = useMediaQuery("(max-width: 1200px)");

  return (
    <html lang="en">
      <body>
        <section className="flex w-full bg-n-1 min-h-screen">
          {/* Sidebar (conditionally rendered based on screen size) */}
          {!isSmallScreens && (
            <div className="flex-shrink-0">
              <aside className="fixed ml-2 top-0 h-full">
                <SideNavbar />
              </aside>
            </div>
          )}

          {/* Main content area */}
          <div
            className={`flex flex-col ${!isSmallScreens ? "ml-64" : ""} w-full`}
          >
            <Navbar />

            {/* Theme wrapper for main content */}
            <Theme>
              <main className="flex w-full p-4">
                {/* Adjust styles for the main content */}
                <div className={`relative ${isSmallScreens ? "w-full" : ""}`}>
                  {children}
                </div>
              </main>
            </Theme>
          </div>
        </section>
      </body>
    </html>
  );
}
