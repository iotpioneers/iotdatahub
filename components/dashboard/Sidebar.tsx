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
import useMediaQuery from "@/hooks/useMediaQuery";

const DashboardSidebar = () => {
  const isSmallScreens = useMediaQuery("(max-width: 1060px)");

  return (
    <div className="flex">
      <ul className="space-y-2 ">
        <li className="py-2 px-4">
          <Link href="/#" className="flex  items-center">
            <CpuChipIcon className="h-4 w-4 mr-2 " />
            {!isSmallScreens && "Devices"}
          </Link>
        </li>
        <li className="py-2 px-4">
          <Link href="/#" className="flex  items-center">
            <SignalIcon className="h-4 w-4 mr-2" />
            {!isSmallScreens && "Channels"}
          </Link>
        </li>
        <li className="py-2 px-4">
          <Link href="/#" className="flex  items-center">
            <CloudArrowDownIcon className="h-4 w-4 mr-2 " />

            {!isSmallScreens && "Data"}
          </Link>
        </li>
        <li className="py-2 px-4">
          <Link href="/#" className="flex  items-center">
            <ChartBarIcon className="h-4 w-4 mr-2" />
            {!isSmallScreens && "Analytics"}
          </Link>
        </li>
        <li className="py-2 px-4">
          <Link href="/#" className="flex  items-center">
            <CogIcon className="h-4 w-4 mr-2" />
            {!isSmallScreens && "Settings"}
          </Link>
        </li>
        <li className="py-2 px-4">
          <Link href="/#" className="flex  items-center">
            <ViewfinderCircleIcon className="h-4 w-4 mr-2" />
            {!isSmallScreens && "Help"}
          </Link>
        </li>
        <li className="py-2 px-4">
          <Link href="/#" className="flex  items-center">
            <InformationCircleIcon className="h-4 w-4 mr-2" />
            {!isSmallScreens && "About"}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default DashboardSidebar;
