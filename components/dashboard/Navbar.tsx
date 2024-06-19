"use client";

import {
  BellIcon,
  Cog8ToothIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  WifiIcon,
} from "@heroicons/react/24/outline";
import { TextField } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <nav className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between w-full sm:w-auto">
        <Link href="/" className="flex">
          <WifiIcon className="h-6 w-6 mx-3" aria-hidden="true" />
          <span className=" hover:text-zinc-950">Ten2Ten</span>
        </Link>
        <img
          src="https://via.placeholder.com/40"
          alt="Profile"
          className="w-10 h-10 rounded-full sm:hidden"
        />
      </div>
      <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto mt-4 sm:mt-0">
        <div className="flex items-center bg-gray-100 p-2 rounded-full w-full sm:w-auto">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
          <TextField.Root placeholder="Search the docs…" className="w-full" />
        </div>
      </div>
      <div className="flex">
        <div className="hidden sm:flex items-center space-x-4">
          <Cog8ToothIcon className="h-6 w-6 text-gray-500" />
          <BellIcon className="h-6 w-6 text-gray-500" />
          <img
            src="https://via.placeholder.com/40"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
        </div>
        <div className="w-10 h-10 text-gray-500">
          <Bars3Icon />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
