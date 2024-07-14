"use client";

import React, { useState } from "react";
import { GiOrganigram, GiUpgrade } from "react-icons/gi";
import { Disclosure } from "@headlessui/react";
import {
  MdOutlineSpaceDashboard,
  MdOutlineAnalytics,
  MdOutlineDevices,
  MdOutlineSettings,
  MdOutlineLogout,
} from "react-icons/md";
import { BiNetworkChart } from "react-icons/bi";
import Link from "next/link";
import { HiViewGrid } from "react-icons/hi";

function SideNavbar() {
  const [activeLink, setActiveLink] = useState("");

  const handleSetActiveLink = (link: string) => {
    setActiveLink(link);
  };

  return (
    <div className="relative hidden lg:flex">
      <Disclosure as="nav">
        <div className="p-6 w-1/2 h-screen bg-white z-20 fixed top-0 -left-96 lg:left-0 lg:w-60 peer-focus:left-0 peer:transition ease-out delay-150 duration-200 border-r border-gray-10 border-5">
          <div className="flex flex-col justify-start item-center">
            <h1 className="text-base text-center cursor-pointer font-bold text-blue-900 border-b border-gray-100 pb-4 w-full">
              <Link href="/" className="flex">
                <img
                  src="logo.svg"
                  alt="logo"
                  className="h-8 w-8 text-gray-10"
                />
                <span className="hover:text-zinc-950">Ten2Ten</span>
              </Link>
            </h1>
            <div className="my-2 border-b border-gray-100 pb-4">
              <Link href="/dashboard">
                <div
                  className={`flex mb-2 justify-start items-center gap-4 pl-5 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto ${
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
                  className={`flex mb-2 justify-start items-center gap-4 pl-5 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto ${
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
                  className={`flex mb-2 justify-start items-center gap-4 pl-5 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto ${
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
            <div className="my-2 border-b border-gray-100 pb-4">
              <Link href="/dashboard/subscription">
                <div
                  className={`flex mb-2 justify-start items-center gap-4 pl-5 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto ${
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
                  className={`flex mb-2 justify-start items-center gap-4 pl-5 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto ${
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
              <Link href="#">
                <div
                  className={`flex mb-2 justify-start items-center gap-4 pl-5 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto ${
                    activeLink === "/dashboard/analytics"
                      ? "bg-gray-900 text-white"
                      : "hover:bg-gray-900 text-gray-600"
                  }`}
                  onClick={() => handleSetActiveLink("/dashboard/analytics")}
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
                  className={`flex mb-2 justify-start items-center gap-4 pl-5 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto ${
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
              <Link href="/api/auth/signout">
                <div
                  className={`flex mb-2 justify-start items-center gap-4 pl-5 border border-gray-200 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto ${
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
        </div>
      </Disclosure>
    </div>
  );
}

export default SideNavbar;
