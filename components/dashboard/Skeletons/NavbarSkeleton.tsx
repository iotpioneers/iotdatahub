"use client";

import useMediaQuery from "@/hooks/useMediaQuery";
import Link from "next/link";
import React from "react";
import Skeleton from "@/components/Skeleton";

const NavbarSkeleton = () => {
  const isSmallScreens = useMediaQuery("(max-width: 1200px)");

  return (
    <nav className="flex flex-col sm:flex-row items-center justify-between my-2 mx-4 pb-2 border-b">
      <div className="flex items-center justify-between w-full sm:w-auto">
        <div className="flex items-center gap-5">
          {isSmallScreens && (
            <div className="rounded-md border-2">
              <Skeleton width={24} height={24} />
            </div>
          )}

          {isSmallScreens && (
            <Link href="/" className="flex">
              <Skeleton width={24} height={24} className="mx-2" />
              <Skeleton width={80} height={24} />
            </Link>
          )}
        </div>

        <div className="flex gap-2 items-center sm:hidden">
          <Skeleton width={24} height={24} />
          <div className="flexCenter hidden z-50">
            <Skeleton width={32} height={32} className="rounded-full" />
          </div>
        </div>
      </div>
      <div className="hidden sm:flex items-center space-x-4">
        <Skeleton width={24} height={24} />
        <Skeleton width={32} height={32} className="rounded-full" />
      </div>
    </nav>
  );
};

export default NavbarSkeleton;
