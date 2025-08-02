"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { GiOrganigram, GiUpgrade } from "react-icons/gi";
import { MdAccountTree, MdOutlineDevices } from "react-icons/md";
import { BiNetworkChart } from "react-icons/bi";
import { HiViewGrid } from "react-icons/hi";
import { AdminPanelSettingsOutlined } from "@mui/icons-material";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Expand, ListCollapse, Settings } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

interface SidebarLink {
  href: string;
  icon: React.ReactNode;
  label: string;
  adminOnly?: boolean;
}

function SideNavbar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (!isMounted || status === "loading") {
    return (
      <aside className="h-screen bg-white dark:bg-gray-800 shadow-md w-64">
        <div className="flex flex-col h-full">
          <div className="p-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <nav className="flex-1 overflow-y-auto p-2 space-y-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
              />
            ))}
          </nav>
        </div>
      </aside>
    );
  }

  if (status === "unauthenticated") return null;

  const userRole = session?.user?.role;

  const links: SidebarLink[] = [
    {
      href: "/dashboard",
      icon: <HiViewGrid className="text-xl" />,
      label: "Overview",
    },
    {
      href: "/dashboard/devices",
      icon: <MdOutlineDevices className="text-xl" />,
      label: "Devices",
    },
    {
      href: "/dashboard/channels",
      icon: <BiNetworkChart className="text-xl" />,
      label: "Channels",
    },
    {
      href: "/dashboard/subscription",
      icon: <GiUpgrade className="text-xl" />,
      label: "Subscriptions",
    },
    {
      href: "/dashboard/account",
      icon: <MdAccountTree className="text-xl" />,
      label: "Account",
    },
    {
      href: "/dashboard/settings",
      icon: <Settings className="text-xl" />,
      label: "Settings",
    },
    {
      href: "/admin",
      icon: <AdminPanelSettingsOutlined className="text-xl" />,
      label: "Administration",
      adminOnly: true,
    },
  ].filter((link) => !link.adminOnly || userRole === "ADMIN");

  return (
    <aside
      className={`block h-screen bg-white dark:bg-gray-800 shadow-md transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-60"
      }`}
    >
      <div className="flex flex-col h-full">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-4 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {isCollapsed ? (
            <Expand className="w-6 h-6 mx-auto" />
          ) : (
            <span className="flex items-center justify-between">
              <span className="flex items-center justify-center">
                <Image
                  src="/IOT_DATA_HUB.png"
                  alt="logo"
                  width={64}
                  height={64}
                  className="cursor-pointer"
                />
                <span className="text-lg font-semibold">IoTDataHub</span>
              </span>
              <ListCollapse className="w-6 h-6" />
            </span>
          )}
        </button>

        <ScrollArea className="flex-1">
          <nav className="p-2">
            <ul className="space-y-1">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <motion.div
                      whileHover={{ scale: isCollapsed ? 1.1 : 1.05 }}
                      className={`flex items-center p-3 rounded-lg transition-colors ${
                        pathname === link.href
                          ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 ${
                          isCollapsed ? "w-6 h-6 mx-auto" : "w-5 h-5"
                        }`}
                      >
                        {link.icon}
                      </div>
                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="ml-3 text-lg font-bold"
                          >
                            {link.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </ScrollArea>
      </div>
    </aside>
  );
}

export default SideNavbar;
