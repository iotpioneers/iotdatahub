"use client";
import { useState } from "react";
import NotificationSection from "./Header/NotificationSection";
import ProfileSection from "./Header/ProfileSection";
import { useSession } from "next-auth/react";
import { FiSearch, FiMenu, FiX } from "react-icons/fi";
import { Input } from "../ui/input";

interface NavbarProps {
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

const Navbar = ({
  onMobileMenuToggle,
  isMobileMenuOpen = false,
}: NavbarProps) => {
  const { status } = useSession();

  if (status !== "loading" && status === "unauthenticated") return null;

  return (
    <header className="w-full bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
      <div className="flex items-center justify-between px-4 py-3 w-full min-h-[64px]">
        {/* Left section with mobile menu and search */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* Mobile menu button */}
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <FiX className="w-5 h-5" />
            ) : (
              <FiMenu className="w-5 h-5" />
            )}
          </button>

          {/* Search bar - Responsive sizing */}
          <div className="relative flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Right section with notifications and profile */}
        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          <div className="hidden sm:block">
            <NotificationSection />
          </div>
          <ProfileSection />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
