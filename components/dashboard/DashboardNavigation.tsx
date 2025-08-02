"use client";

import React, { useState } from "react";
import Navbar from "@/components/dashboard/Navbar";
import SideNavbar from "@/components/sidebar/SideNavbar";

// ==============================|| MAIN LAYOUT ||============================== //

const DashboardNavigation = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex">
      {/* header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-12 bg-background py-2 mb-2">
        <div className="h-10 px-4 flex items-center">
          <Navbar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </div>
      </header>

      {/* drawer */}
      <SideNavbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
    </div>
  );
};

export default DashboardNavigation;
