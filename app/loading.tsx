"use client";

import React from "react";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import useMediaQuery from "@/hooks/useMediaQuery";
import {
  DashboardSkeleton,
  NavbarSkeleton,
  SideBarSkeleton,
} from "@/components/dashboard/Skeletons";

const Loading: React.FC = () => {
  const isSmallScreens = useMediaQuery("(max-width: 1200px)");

  return (
    <section className="flex w-full min-h-screen">
      {!isSmallScreens && (
        <div className="flex-shrink-0">
          <aside className="fixed left-0 top-0 h-full">
            <SideBarSkeleton />
          </aside>
        </div>
      )}

      <div className={`flex flex-col ${!isSmallScreens ? "ml-64" : ""} w-full`}>
        <NavbarSkeleton />

        <Theme>
          <main className="flex w-full">
            <div className={`relative ${isSmallScreens ? "w-full" : ""}`}>
              <DashboardSkeleton />
            </div>
          </main>
        </Theme>
      </div>
    </section>
  );
};

export default Loading;
