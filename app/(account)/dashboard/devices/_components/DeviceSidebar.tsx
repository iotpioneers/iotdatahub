"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  Database,
  Sliders,
  Settings,
  Activity,
  Bell,
  BookOpen,
  Smartphone,
  Mic,
  FolderOpen,
  X,
  Menu,
} from "lucide-react";
import Link from "next/link";
import DeviceSidebarToggle from "./DeviceSidebarToggle";

interface SidebarProps {
  deviceId: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen?: (isOpen: boolean) => void;
}

const DeviceSidebar: React.FC<SidebarProps> = ({
  deviceId,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const toggleSidebar = () => {
    if (setIsSidebarOpen) {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const menuItems = [
    { icon: <Home size={20} />, label: "Home", path: "/" },
    {
      icon: <Database size={20} />,
      label: "Datastreams",
      path: "/dashboard/devices/${deviceId}/datastreams",
    },
    {
      icon: <Sliders size={20} />,
      label: "Web Dashboard",
      path: `/dashboard/devices/${deviceId}`,
      active: true,
    },
    {
      icon: <Activity size={20} />,
      label: "Automation Templates",
      path: "/dashboard/devices/${deviceId}/automations",
    },
    {
      icon: <Settings size={20} />,
      label: "Metadata",
      path: "/dashboard/devices/${deviceId}/metadata",
    },
    {
      icon: <Activity size={20} />,
      label: "Connection Lifecycle",
      path: "/dashboard/devices/${deviceId}/connections",
    },
    {
      icon: <Bell size={20} />,
      label: "Events & Notifications",
      path: "/dashboard/devices/${deviceId}/events",
    },
    { icon: <BookOpen size={20} />, label: "User Guides", path: "/guides" },
    {
      icon: <Smartphone size={20} />,
      label: "Mobile Dashboard",
      path: "/dashboard/devices/${deviceId}/mobile",
    },
    {
      icon: <Mic size={20} />,
      label: "Voice Assistants",
      path: "/dashboard/devices/${deviceId}/voice",
    },
    {
      icon: <FolderOpen size={20} />,
      label: "Assets",
      path: "/dashboard/devices/${deviceId}/assets",
    },
  ];

  return (
    <aside
      className={`bg-white transition-all border-t duration-300 ${
        isSidebarOpen ? "w-48" : "w-16"
      } h-full z-10 rounded-md px-1`}
    >
      <div className="border-b py-1 border-gray-200 flex items-center justify-between">
        <DeviceSidebarToggle
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
      </div>

      <nav>
        <ul className="overflow-y-auto">
          {menuItems.map((item, index) => (
            <li key={index} className="py-1.5">
              <Link
                href={item.path}
                className={`flex items-center p-1 text-gray-600 hover:bg-gray-100 ${
                  !isSidebarOpen ? "justify-center" : "px-2"
                } ${item.active ? "bg-gray-100" : ""}`}
              >
                <span className="text-gray-500">{item.icon}</span>
                {isSidebarOpen && (
                  <span className="ml-1 text-sm font-medium truncate">
                    {item.label}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default DeviceSidebar;
