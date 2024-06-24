"use client";

import useMediaQuery from "@/hooks/useMediaQuery";
import {
  BellIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  WifiIcon,
} from "@heroicons/react/24/outline";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  HoverCard,
  IconButton,
  Text,
  TextField,
} from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import NotificationIcon from "./NotificationIcon";
import AvatarIcon from "../Home/AvatarIcon";

const Navbar = () => {
  const isSmallScreens = useMediaQuery("(max-width: 1200px)");

  return (
    <nav className="flex flex-col sm:flex-row items-center justify-between my-4 mx-4 border-b">
      <div className="flex items-center justify-between w-full sm:w-auto">
        <div className="flex items-center gap-5">
          {isSmallScreens && (
            <div className="rounded-md border-2 ">
              <Bars3Icon className="h-6 w-6" />
            </div>
          )}

          {isSmallScreens && (
            <Link href="/" className="flex ">
              <WifiIcon className="h-6 w-6 mx-2" aria-hidden="true" />
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
      <div className="sm:hidden flex sm:flex-row items-center w-full sm:w-auto mt-4 sm:mt-0">
        <div className="flex items-center bg-gray-100 p-2 rounded-full w-full sm:w-auto">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
          <TextField.Root placeholder="Search…" className="w-full" />
        </div>
      </div>
      <div className="hidden sm:flex items-center space-x-4">
        <div className="flex sm:flex-row items-center w-full sm:w-auto mt-4 sm:mt-0">
          <div className="flex items-center bg-gray-100 p-2 rounded-full w-full sm:w-auto">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
          </div>
        </div>

        <NotificationIcon />

        <div>
          <AvatarIcon />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
