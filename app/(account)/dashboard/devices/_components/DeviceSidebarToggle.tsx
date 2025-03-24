"use client";

import React from "react";
import { Menu, X } from "lucide-react";

interface SidebarToggleProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const DeviceSidebarToggle: React.FC<SidebarToggleProps> = ({
  isOpen,
  toggleSidebar,
}) => {
  return (
    <button
      onClick={toggleSidebar}
      className="px-4 py-3 rounded-md hover:bg-gray-100 focus:outline-none"
      aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
    >
      {isOpen ? <X size={20} /> : <Menu size={20} />}
    </button>
  );
};

export default DeviceSidebarToggle;
