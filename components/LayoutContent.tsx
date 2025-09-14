"use client";

import type React from "react";
import { useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/dashboard/Navbar";
import { Theme } from "@radix-ui/themes";
import { ToastProvider } from "@/components/ui/toast-provider";

const Sidebar = dynamic(() => import("@/components/sidebar/SideNavbar"), {
  loading: () => (
    <aside className="h-full bg-white dark:bg-gray-800 shadow-md w-52 flex-shrink-0">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
            />
          ))}
        </nav>
      </div>
    </aside>
  ),
});

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Single Sidebar - handles both desktop and mobile states */}
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={handleMobileMenuClose}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Navbar */}
        <div className="flex-shrink-0 z-30 relative">
          <Navbar
            onMobileMenuToggle={handleMobileMenuToggle}
            isMobileMenuOpen={isMobileMenuOpen}
          />
        </div>

        {/* Main content */}
        <Theme>
          <main className="flex-1 overflow-y-auto overflow-x-hidden w-full bg-white dark:bg-gray-900">
            <div className="p-4 sm:p-6 lg:p-8 min-h-full">
              <div className="max-w-full">
                <ToastProvider>{children}</ToastProvider>
              </div>
            </div>
          </main>
        </Theme>
      </div>
    </div>
  );
}
