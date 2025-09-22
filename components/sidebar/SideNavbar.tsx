"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { GiUpgrade } from "react-icons/gi";
import { MdAccountTree, MdOutlineDevices } from "react-icons/md";
import { BiNetworkChart } from "react-icons/bi";
import { HiViewGrid } from "react-icons/hi";
import { AdminPanelSettingsOutlined } from "@mui/icons-material";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Image from "next/image";
import UpgradePlanCardAlert from "./DownloadLibraryCard";

interface SidebarLink {
  href: string;
  icon: React.ReactNode;
  label: string;
  adminOnly?: boolean;
}

interface SideNavbarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

function SideNavbar({ isMobileOpen = false, onMobileClose }: SideNavbarProps) {
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

  // Handle responsive collapse on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  if (!isMounted || status === "loading") {
    return (
      <aside className="hidden md:block h-full bg-white dark:bg-gray-800 shadow-md w-52 flex-shrink-0">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <nav className="flex-1 overflow-y-auto p-3 space-y-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
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
      icon: <HiViewGrid className="text-xl flex-shrink-0" />,
      label: "Overview",
    },
    {
      href: "/dashboard/devices",
      icon: <MdOutlineDevices className="text-xl flex-shrink-0" />,
      label: "Devices",
    },
    {
      href: "/dashboard/channels",
      icon: <BiNetworkChart className="text-xl flex-shrink-0" />,
      label: "Channels",
    },
    {
      href: "/dashboard/subscription",
      icon: <GiUpgrade className="text-xl flex-shrink-0" />,
      label: "Subscriptions",
    },
    {
      href: "/dashboard/account",
      icon: <MdAccountTree className="text-xl flex-shrink-0" />,
      label: "Account",
    },
    {
      href: "/dashboard/settings",
      icon: <Settings className="text-xl flex-shrink-0" />,
      label: "Settings",
    },
    {
      href: "/admin",
      icon: <AdminPanelSettingsOutlined className="text-xl flex-shrink-0" />,
      label: "Administration",
      adminOnly: true,
    },
  ].filter((link) => !link.adminOnly || userRole === "ADMIN");

  const sidebarWidth = isCollapsed ? "w-16" : "w-52 lg:w-48 xl:w-52";

  // For small screens when mobile is open, always show full width
  const shouldShowFullContent = isMobileOpen || !isCollapsed;

  return (
    <TooltipProvider>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${isMobileOpen ? "w-54" : sidebarWidth}
          h-full bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out flex-shrink-0
          ${
            isMobileOpen
              ? "fixed left-0 top-0 z-50 md:relative"
              : "hidden md:flex"
          }
          flex flex-col
        `}
      >
        {/* Header with logo and collapse button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <button
            onClick={() => router.push("/")}
            className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-lg min-w-0"
          >
            <Image
              src="/IOT_DATA_HUB.png"
              alt="IoTDataHub Logo"
              width={32}
              height={32}
              className="flex-shrink-0"
            />
            <AnimatePresence>
              {shouldShowFullContent && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-lg font-semibold truncate"
                >
                  IoTDataHub
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Collapse button - only show on desktop */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>

          {/* Close button for mobile */}
          {isMobileOpen && (
            <button
              onClick={onMobileClose}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close sidebar"
            >
              ×
            </button>
          )}
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 h-0">
          <nav className="p-3">
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => {
                      if (onMobileClose) {
                        onMobileClose();
                      }
                    }}
                  >
                    {isCollapsed && !isMobileOpen ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`
                              flex items-center justify-center p-3 rounded-lg transition-all duration-200 group relative
                              ${
                                pathname === link.href
                                  ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 shadow-sm"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              }
                            `}
                          >
                            <div className="flex-shrink-0 flex items-center justify-center w-6 h-6">
                              {link.icon}
                            </div>
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="ml-2">
                          <p>{link.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                          flex items-center p-3 rounded-lg transition-all duration-200 group relative
                          ${
                            pathname === link.href
                              ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 shadow-sm"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }
                        `}
                      >
                        <div className="flex-shrink-0 flex items-center justify-center w-6 h-6">
                          {link.icon}
                        </div>

                        <AnimatePresence>
                          {shouldShowFullContent && (
                            <motion.span
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              transition={{ duration: 0.15 }}
                              className="ml-3 text-sm font-medium truncate min-w-0"
                            >
                              {link.label}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </ScrollArea>

        {/* Download Library Card */}
        {shouldShowFullContent && (
          <div className="my-2">
            <UpgradePlanCardAlert />
          </div>
        )}

        {/* Footer - User info or additional controls */}
        {shouldShowFullContent && (
          <div className="flex items-center justify-center p-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage
                src={session?.user?.image || ""}
                alt={session?.user?.name || ""}
              />
              <AvatarFallback className="bg-orange-50 text-primary-foreground font-bold">
                {(session?.user?.name &&
                  session?.user?.name.charAt(0).toUpperCase() +
                    session?.user?.name.charAt(1).toUpperCase()) ||
                  "U"}
              </AvatarFallback>
            </Avatar>
            <div className="grid place-items-start text-xs text-gray-900 dark:text-gray-400 text-center font-bold">
              <div className="text-orange-50">{session?.user?.name}</div>
              <div>{session?.user?.email}</div>
            </div>
          </div>
        )}
      </aside>
    </TooltipProvider>
  );
}

export default SideNavbar;
