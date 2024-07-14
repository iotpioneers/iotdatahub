import React from "react";
import Navbar from "@/components/Dashboard/Navbar";
import SideNavbar from "@/components/Sidebar/SideNavbar";

const DashboardNavigation = () => {
  return (
    <div className="flex bg-white">
      <SideNavbar />
      <div className="flex flex-col flex-grow lg:ml-64 mx-5 sm:mx-2">
        <Navbar />
      </div>
    </div>
  );
};

export default DashboardNavigation;
