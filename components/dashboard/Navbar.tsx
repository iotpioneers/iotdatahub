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
    <nav className="flex flex-col sm:flex-row items-center justify-between my-2 pb-2 border-b">
      <div className="flex items-center justify-between w-full ">
        <div className="flex items-center gap-5">
          {isSmallScreens && (
            <div className="rounded-md border-2 ">
              <Bars3Icon className="h-6 w-6 text-zinc-950" />
            </div>
          )}

          {isSmallScreens && (
            <Link
              href="/"
              className="flex justify-center items-center text-n-7"
            >
              <img src="logo.svg" alt="logo" className="h-8 w-8 text-gray-10" />
              <span className="hover:text-zinc-950 text-xl">Ten2Ten</span>
            </Link>
          )}
        </div>

        <div className="flex gap-2 items-center">
          <NotificationIcon />
          <div className="flexCenter z-50">
            <AvatarIcon />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
