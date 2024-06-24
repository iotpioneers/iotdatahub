"use client";

import "@radix-ui/themes/styles.css";
import Navbar from "@/components/dashboard/Navbar";
import { Theme } from "@radix-ui/themes";
import useMediaQuery from "@/hooks/useMediaQuery";
import SideNavbar from "@/components/sidebar/SideNavbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isSmallScreens = useMediaQuery("(max-width: 1200px)");

  return (
    <section className="flex w-full">
      {/* Sidebar (conditionally rendered based on screen size) */}
      {!isSmallScreens && (
        <aside className="ml-44">
          <SideNavbar />
        </aside>
      )}

      {/* Main content area */}
      <div className="flex flex-col w-full h-screen bg-gray-100 -mr-20">
        <Navbar />

        {/* Theme wrapper for main content */}
        <Theme>
          <main className="flex w-full gap-1 mr-5">
            {/* Adjust styles for the main content */}
            <div className={`relative ${isSmallScreens ? "w-full" : "ml-5"}`}>
              {children}
            </div>
          </main>
        </Theme>
      </div>
    </section>
  );
}
