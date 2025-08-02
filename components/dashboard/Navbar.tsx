"use client";

import * as React from "react";
import NotificationSection from "./Header/NotificationSection";
import ProfileSection from "./Header/ProfileSection";
import { useSession } from "next-auth/react";
import { FiSearch } from "react-icons/fi";
import { Input } from "../ui/input";

const Navbar = () => {
  const { status } = useSession();

  if (status !== "loading" && status === "unauthenticated") return null;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search ..."
              className="block pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <NotificationSection />
          <ProfileSection />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
