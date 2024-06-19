"use client";

import Link from "next/link";
import React from "react";
import {
  ChartBarIcon,
  Cog8ToothIcon,
  InformationCircleIcon,
  SignalIcon,
  CloudArrowDownIcon,
  CpuChipIcon,
  ViewfinderCircleIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

const DashboardSidebar = () => {
  return (
    <div className="flex">
      <ul className="space-y-2">
        <li className="py-2 px-4">
          <Link href="/dashboard" className="flex  items-center">
            <AcademicCapIcon className="h-4 w-4 mr-2 " />
            Dashboard
          </Link>
        </li>
        <li className="py-2 px-4">
          <Link href="/dashboard/channels" className="flex  items-center">
            <SignalIcon className="h-4 w-4 mr-2" />
            Channels
          </Link>
        </li>

        <li className="py-2 px-4">
          <Link href="/dashboard/devices" className="flex  items-center">
            <CpuChipIcon className="h-4 w-4 mr-2 " />
            Devices
          </Link>
        </li>
        <li className="py-2 px-4">
          <Link href="/dashboard" className="flex  items-center">
            <CloudArrowDownIcon className="h-4 w-4 mr-2 " />
            Data
          </Link>
        </li>
        <li className="py-2 px-4">
          <Link href="/dashboard" className="flex  items-center">
            <ChartBarIcon className="h-4 w-4 mr-2" />
            Analytics
          </Link>
        </li>
        <li className="py-2 px-4">
          <Link href="/dashboard" className="flex  items-center">
            <Cog8ToothIcon className="h-4 w-4 mr-2" />
            Settings
          </Link>
        </li>
        <li className="py-2 px-4">
          <Link href="/dashboard" className="flex  items-center">
            <ViewfinderCircleIcon className="h-4 w-4 mr-2" />
            Help
          </Link>
        </li>
        <li className="py-2 px-4">
          <Link href="/dashboard" className="flex  items-center">
            <InformationCircleIcon className="h-4 w-4 mr-2" />
            About
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default DashboardSidebar;
