"use client";

import "@radix-ui/themes/styles.css";
import Navbar from "@/components/dashboard/Navbar";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import { Theme } from "@radix-ui/themes";
import useMediaQuery from "@/hooks/useMediaQuery";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isSmallScreens = useMediaQuery("(max-width: 1200px)");

  return (
    <section className="flex w-full">
      <div className="-ml-16 mr-16 mt-8">
        {!isSmallScreens && (
          <aside className="w-1/5 rounded-sm h-screen border-solid fixed">
            <DashboardSidebar />
          </aside>
        )}
      </div>

      <div className={`block ${isSmallScreens ? "mx-5" : "ml-24 -mr-12"} `}>
        <Navbar />
        <Theme>
          <main className="flex w-full gap-1">
            <div className="relative">{children}</div>
          </main>
        </Theme>
      </div>
    </section>
  );
}
