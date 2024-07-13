import React from "react";
import Navbar from "@/components/dashboard/Navbar";
import SideNavbar from "@/components/sidebar/SideNavbar";

const DashboardNavigation = () => {
  return (
    <div className="flex bg-white">
      <SideNavbar />
      <div className="flex flex-col flex-grow lg:ml-64 xs:mx-2">
        <Navbar />
      </div>
    </div>
  );
};

export default DashboardNavigation;
