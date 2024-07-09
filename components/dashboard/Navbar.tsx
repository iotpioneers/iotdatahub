"use client";

import useMediaQuery from "@/hooks/useMediaQuery";
import { Bars3Icon, WifiIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React from "react";
import NotificationIcon from "./NotificationIcon";
import AvatarIcon from "../Home/AvatarIcon";

const Navbar = () => {
  const isSmallScreens = useMediaQuery("(max-width: 1200px)");

  return (
    <nav className="flex flex-col sm:flex-row items-center justify-between my-2 mx-4 pb-2 border-b">
      <div className="flex items-center justify-between w-full sm:w-auto">
        <div className="flex items-center gap-5">
          {isSmallScreens && (
            <div className="rounded-md border-2 ">
              <Bars3Icon className="h-6 w-6 text-zinc-950" />
            </div>
          )}

          {isSmallScreens && (
            <Link href="/" className="flex text-n-7">
              <WifiIcon
                className="animate-pulse h-6 w-6 mx-2"
                aria-hidden="true"
              />
              <span className="hover:text-zinc-950">Ten2Ten</span>
            </Link>
          )}
        </div>

        <div className="flex gap-2 items-center sm:hidden">
          <NotificationIcon />
          <div className="flexCenter hidden z-50">
            <AvatarIcon />
          </div>
        </div>
      </div>
      <div className="hidden sm:flex items-center space-x-4">
        <NotificationIcon />

        <div>
          <AvatarIcon />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
