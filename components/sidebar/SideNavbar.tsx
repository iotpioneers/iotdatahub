"use client";

import React, { useState } from "react";
import { GiOrganigram, GiUpgrade } from "react-icons/gi";
import { Disclosure } from "@headlessui/react";
import {
  MdOutlineAnalytics,
  MdOutlineDevices,
  MdOutlineSettings,
  MdOutlineLogout,
  MdManageAccounts,
} from "react-icons/md";
import { BiNetworkChart } from "react-icons/bi";
import Link from "next/link";
import { HiViewGrid } from "react-icons/hi";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import Drawer from "@mui/material/Drawer";

interface SidebarContentProps {
  activeLink: string;
  handleSetActiveLink: (link: string) => void;
}

function SideNavbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  const handleSetActiveLink = (link: string) => {
    setActiveLink(link);
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="py-3">
      <IconButton
        aria-label="toggle drawer"
        edge="start"
        onClick={toggleSidebar}
        sx={{ marginLeft: 1, display: { lg: "none" } }}
      >
        {isSidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
      </IconButton>
      <Drawer
        anchor="left"
        open={isSidebarOpen}
        onClose={toggleSidebar}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        <div className="flex justify-between items-center px-4 py-2">
          <IconButton
            aria-label="toggle drawer"
            edge="start"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
        </div>
        <SidebarContent
          activeLink={activeLink}
          handleSetActiveLink={handleSetActiveLink}
        />
      </Drawer>
      <div
        className={`relative ${
          isSidebarOpen ? "flex" : "hidden"
        } lg:flex bg-white`}
      >
        <Disclosure as="nav">
          <div className="p-6 w-1/2 h-screen bg-white z-20 fixed top-0 lg:left-0 lg:w-60 border-r border-gray-10 border-5">
            <SidebarContent
              activeLink={activeLink}
              handleSetActiveLink={handleSetActiveLink}
            />
          </div>
        </Disclosure>
      </div>
    </div>
  );
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  activeLink,
  handleSetActiveLink,
}) => {
  return (
    <div className="flex flex-col justify-start item-center">
      <h1 className="text-base text-center justify-center cursor-pointer font-bold text-blue-900 border-b border-gray-100 pb-6 w-full">
        <Link href="/" className="flex justify-center items-center gap-1">
          <img src="logo.svg" alt="logo" className="h-8 w-8 text-gray-10" />
          <span className="hover:text-zinc-950">IoTDataHub</span>
        </Link>
      </h1>
      <div className="border-b border-gray-100 pb-4">
        <Link href="/dashboard">
          <div
            className={`flex mb-0 xs:mb-2 justify-start items-center gap-4 pl-5 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto ${
              activeLink === "/dashboard"
                ? "bg-gray-900 text-white"
                : "hover:bg-gray-900 text-gray-600"
            }`}
            onClick={() => handleSetActiveLink("/dashboard")}
          >
            <HiViewGrid className="text-2xl text-gray-600" />
            <h3 className="text-base font-semibold">Overview</h3>
          </div>
        </Link>
        <Link href="/dashboard/devices">
          <div
            className={`flex -mb-1 xs:mb-0 md:mb-1 lg:mb-2 justify-start items-center gap-4 pl-5 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto ${
              activeLink === "/dashboard/devices"
                ? "bg-gray-900 text-white"
                : "hover:bg-gray-900 text-gray-600"
            }`}
            onClick={() => handleSetActiveLink("/dashboard/devices")}
          >
            <MdOutlineDevices className="text-2xl text-gray-600" />
            <h3 className="text-base font-semibold">Devices</h3>
          </div>
        </Link>
        <Link href="/dashboard/channels">
          <div
            className={`flex -mb-1 xs:mb-0 md:mb-1 lg:mb-2 justify-start items-center gap-4 pl-5 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto ${
              activeLink === "/dashboard/channels"
                ? "bg-gray-900 text-white"
                : "hover:bg-gray-900 text-gray-600"
            }`}
            onClick={() => handleSetActiveLink("/dashboard/channels")}
          >
            <BiNetworkChart className="text-2xl text-gray-600" />
            <h3 className="text-base font-semibold">Channels</h3>
          </div>
        </Link>
      </div>
      {/* setting  */}
      <div className=" border-b border-gray-100 pb-4">
        <Link href="/dashboard/subscription">
          <div
            className={`flex -mb-1 xs:mb-0 md:mb-1 lg:mb-2 justify-start items-center gap-4 pl-5 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto ${
              activeLink === "/dashboard/subscription"
                ? "bg-gray-900 text-white"
                : "hover:bg-gray-900 text-gray-600"
            }`}
            onClick={() => handleSetActiveLink("/dashboard/subscription")}
          >
            <GiUpgrade className="text-2xl text-gray-600" />
            <h3 className="text-base font-semibold">Upgrade Plan</h3>
          </div>
        </Link>
        <Link href="#">
          <div
            className={`flex -mb-1 xs:mb-0 md:mb-1 lg:mb-2 justify-start items-center gap-4 pl-5 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto ${
              activeLink === "/dashboard/analytics"
                ? "bg-gray-900 text-white"
                : "hover:bg-gray-900 text-gray-600"
            }`}
            onClick={() => handleSetActiveLink("/dashboard/analytics")}
          >
            <MdOutlineAnalytics className="text-2xl text-gray-600" />
            <h3 className="text-base font-semibold">Analytics</h3>
          </div>
        </Link>
        <Link href="/dashboard/organization">
          <div
            className={`flex -mb-1 xs:mb-0 md:mb-1 lg:mb-2 justify-start items-center gap-4 pl-5 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto ${
              activeLink === "/dashboard/organization"
                ? "bg-gray-900 text-white"
                : "hover:bg-gray-900 text-gray-600"
            }`}
            onClick={() => handleSetActiveLink("/dashboard/organization")}
          >
            <GiOrganigram className="text-2xl text-gray-600" />
            <h3 className="text-base font-semibold">Organization</h3>
          </div>
        </Link>
      </div>
      {/* logout */}
      <div className="my-2">
        <Link href="/dashboard/settings">
          <div
            className={`flex -mb-1 xs:mb-0 md:mb-1 lg:mb-2 justify-start items-center gap-4 pl-5 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto ${
              activeLink === "/dashboard/settings"
                ? "bg-gray-900 text-white"
                : "hover:bg-gray-900 text-gray-600"
            }`}
            onClick={() => handleSetActiveLink("/dashboard/settings")}
          >
            <MdOutlineSettings className="text-2xl text-gray-600" />
            <h3 className="text-base font-semibold">Settings</h3>
          </div>
        </Link>
        <Link href="/dashboard/account">
          <div
            className={`flex -mb-1 xs:mb-0 md:mb-1 lg:mb-2 justify-start items-center gap-4 pl-5 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto ${
              activeLink === "/dashboard/account"
                ? "bg-gray-900 text-white"
                : "hover:bg-gray-900 text-gray-600"
            }`}
            onClick={() => handleSetActiveLink("/dashboard/account")}
          >
            <MdManageAccounts className="text-2xl text-gray-600" />
            <h3 className="text-base font-semibold">Account</h3>
          </div>
        </Link>
        <Link href="/api/auth/signout">
          <div
            className={`flex -mb-1 xs:mb-0 md:mb-1 lg:mb-2 justify-start items-center gap-4 pl-5 border border-gray-200 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto ${
              activeLink === "/api/auth/signout"
                ? "bg-gray-900 text-white"
                : "hover:bg-gray-900 text-gray-600"
            }`}
            onClick={() => handleSetActiveLink("/api/auth/signout")}
          >
            <MdOutlineLogout className="text-2xl text-gray-600" />
            <h3 className="text-base font-semibold">Logout</h3>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SideNavbar;
