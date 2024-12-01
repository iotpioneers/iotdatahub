"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { GiOrganigram } from "react-icons/gi";
import { Disclosure } from "@headlessui/react";
import { MdOutlineDevices } from "react-icons/md";
import { BiNetworkChart } from "react-icons/bi";
import Link from "next/link";
import { HiViewGrid } from "react-icons/hi";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import Drawer from "@mui/material/Drawer";
import { AdminPanelSettingsOutlined } from "@mui/icons-material";

import LoadingProgressBar from "../LoadingProgressBar";
import UpgradePlanCardAlert from "./UpgradePlanCardAlert";
import { Logo } from "../Home/Logo";

interface SidebarContentProps {
  isLoading: boolean;
  activeLink: string;
  handleSetActiveLink: (link: string) => void;
}

function SideNavbar({
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  const handleSetActiveLink = (link: string) => {
    try {
      setActiveLink(link);
      setIsLoading(true);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
    setTimeout(() => {}, 5000);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Drawer
        anchor="left"
        open={isSidebarOpen}
        onClose={toggleSidebar}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        <div className="flex justify-between items-center px-4 py-8">
          <Logo />
          <IconButton
            aria-label="toggle drawer"
            edge="start"
            onClick={toggleSidebar}
            className="text-black"
          >
            {isSidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
        </div>
        <div className="px-2">
          <SidebarContent
            isLoading={isLoading}
            activeLink={activeLink}
            handleSetActiveLink={handleSetActiveLink}
          />
        </div>
      </Drawer>
      <div className={`relative hidden lg:flex bg-white`}>
        <Disclosure as="nav">
          <div className="p-6 w-1/2 h-screen bg-white z-20 fixed top-0 lg:left-0 lg:w-60 border-r border-gray-10 border-5 overflow-y-auto">
            <SidebarContent
              isLoading={isLoading}
              activeLink={activeLink}
              handleSetActiveLink={handleSetActiveLink}
            />
          </div>
        </Disclosure>
      </div>
    </>
  );
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  isLoading,
  activeLink,
  handleSetActiveLink,
}) => {
  const { status, data: session } = useSession();

  if (status !== "loading" && status === "unauthenticated") {
    return null;
  }

  const userRole = session!.user!.role;

  return (
    <div className="flex flex-col justify-start item-center mt-0 lg:mt-24">
      <div className="border-b border-gray-100 pb-4">
        <Link href="/dashboard">
          <div
            className={`flex mb-0 xs:mb-2 justify-start items-center gap-4 pl-5 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto ${
              activeLink === "/dashboard"
                ? "bg-gray-300 text-white"
                : "hover:bg-gray-200 text-black"
            }`}
            onClick={() => handleSetActiveLink("/dashboard")}
          >
            <HiViewGrid className="text-2xl text-black" />
            <h3 className="text-base font-semibold text-black">Overview</h3>
          </div>
          {activeLink === "/dashboard" && isLoading && <LoadingProgressBar />}
        </Link>
        <Link href="/organization/dashboard">
          <div
            className={`flex -mb-1 xs:mb-0 md:mb-1 lg:mb-2 justify-start items-center gap-4 pl-5 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto ${
              activeLink === "/organization/dashboard"
                ? "bg-gray-300 text-white"
                : "hover:bg-gray-200 text-black"
            }`}
            onClick={() => handleSetActiveLink("/organization/dashboard")}
          >
            <MdOutlineDevices className="text-2xl text-black" />
            <h3 className="text-base font-semibold text-black">Devices</h3>
          </div>
          {activeLink === "/organization/dashboard" && isLoading && (
            <LoadingProgressBar />
          )}
        </Link>
        <Link href="/dashboard/channels">
          <div
            className={`flex -mb-1 xs:mb-0 md:mb-1 lg:mb-2 justify-start items-center gap-4 pl-5 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto ${
              activeLink === "/dashboard/channels"
                ? "bg-gray-300 text-white"
                : "hover:bg-gray-200 text-black"
            }`}
            onClick={() => handleSetActiveLink("/dashboard/channels")}
          >
            <BiNetworkChart className="text-2xl text-black" />
            <h3 className="text-base font-semibold text-black">Channels</h3>
          </div>
          {activeLink === "/dashboard/channels" && isLoading && (
            <LoadingProgressBar />
          )}
        </Link>
      </div>
      {/* setting  */}
      <div className=" border-b border-gray-100 pb-4">
        {userRole === "ADMIN" && (
          <Link href="/admin">
            <div
              className={`flex -mb-1 xs:mb-0 md:mb-1 lg:mb-2 justify-start items-center gap-4 pl-5 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto ${
                activeLink === "/admin"
                  ? "bg-gray-300 text-white"
                  : "hover:bg-gray-200 text-black"
              }`}
              onClick={() => handleSetActiveLink("/admin")}
            >
              <AdminPanelSettingsOutlined className="text-2xl text-black" />
              <h3 className="text-base font-semibold text-black">
                Administration
              </h3>
            </div>
            {activeLink === "/admin" && isLoading && <LoadingProgressBar />}
          </Link>
        )}
        <Link href="/organization/dashboard">
          <div
            className={`flex -mb-1 xs:mb-0 md:mb-1 lg:mb-2 justify-start items-center gap-4 pl-5 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto ${
              activeLink === "/organization/dashboard"
                ? "bg-gray-300 text-white"
                : "hover:bg-gray-200 text-black"
            }`}
            onClick={() => handleSetActiveLink("/organization/dashboard")}
          >
            <GiOrganigram className="text-2xl text-black" />
            <h3 className="text-base font-semibold text-black">Organization</h3>
          </div>
          {activeLink === "/organization/dashboard" && isLoading && (
            <LoadingProgressBar />
          )}
        </Link>
      </div>

      {/* Upgrade Plan Card */}
      <div className="my-2">
        <UpgradePlanCardAlert />
      </div>
    </div>
  );
};

export default SideNavbar;
