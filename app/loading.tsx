"use client";

import React from "react";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import useMediaQuery from "@/hooks/useMediaQuery";
import { LoadingSkeleton } from "@/components/dashboard/Skeletons";

const Loading: React.FC = () => {
  const isSmallScreens = useMediaQuery("(max-width: 1200px)");

  return (
    <section className="flex w-full min-h-screen">
      <div className={`flex flex-col ${!isSmallScreens ? "ml-64" : ""} w-full`}>
        <Theme>
          <main className="flex w-full">
            <div className={`relative ${isSmallScreens ? "w-full" : ""}`}>
              <LoadingSkeleton />
            </div>
          </main>
        </Theme>
      </div>
    </section>
  );
};

export default Loading;
