"use client";

import Link from "next/link";
import React from "react";
import {
  ChartBarIcon,
  CogIcon,
  InformationCircleIcon,
  SignalIcon,
  CloudArrowDownIcon,
  CpuChipIcon,
  ViewfinderCircleIcon,
} from "@heroicons/react/24/outline";

const DashboardSidebar = () => {
  return (
    <div className="h-full">
      <h2 className="text-lg font-semibold mb-4">Dashboard</h2>
      <ul className="space-y-2">
        <li className="flex py-2 px-4 items-center">
          <CpuChipIcon className="h-4 w-4 mr-2" />
          <Link href="/#">Devices</Link>
        </li>
        <li className="flex py-2 px-4 items-center">
          <SignalIcon className="h-4 w-4 mr-2" />
          <Link href="/#">Channels</Link>
        </li>
        <li className="flex py-2 px-4 items-center">
          <CloudArrowDownIcon className="h-4 w-4 mr-2" />
          <Link href="/#">Data</Link>
        </li>
        <li className="flex py-2 px-4 items-center">
          <ChartBarIcon className="h-4 w-4 mr-2" />
          <Link href="/#">Analytics</Link>
        </li>
        <li className="flex py-2 px-4 items-center">
          <CogIcon className="h-4 w-4 mr-2" />
          <Link href="/#">Settings</Link>
        </li>
        <li className="flex py-2 px-4 items-center">
          <ViewfinderCircleIcon className="h-4 w-4 mr-2" />
          <Link href="/#">Help</Link>
        </li>
        <li className="flex py-2 px-4 items-center">
          <InformationCircleIcon className="h-4 w-4 mr-2" />
          <Link href="/#">About</Link>
        </li>
      </ul>
    </div>
  );
};

export default DashboardSidebar;
