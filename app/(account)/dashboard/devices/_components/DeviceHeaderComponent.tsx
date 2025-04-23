"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Box, MoreHorizontal, AlertCircle, Download } from "lucide-react";
import { Dropdown, MenuButton, Menu, MenuItem } from "@mui/base";
import { Button } from "@mui/material";

interface HeaderProps {
  deviceId: string;
  isLoading: boolean;
  onSave: () => Promise<void>;
  onCancel: () => void;
}

const DeviceHeaderComponent: React.FC<HeaderProps> = ({
  deviceId,
  isLoading,
  onSave,
  onCancel,
}) => {
  const router = useRouter();

  return (
    <header
      className=" bg-white border-gray-200 z-20 shadow-sm h-10 px-2 py-1 rounded-md"
      style={{
        left: "10%",
        transition: "left 0.3s",
      }}
    >
      <div className="flex items-center justify-start">
        <div className="flex items-center space-x-2">
          <Dropdown>
            <MenuButton className="p-1 rounded-md hover:bg-gray-100 shadow shadow-black">
              <MoreHorizontal size={24} color="#10B981" />
            </MenuButton>
            <Menu className="bg-white shadow-lg rounded-md p-1 min-w-[180px] z-50">
              <MenuItem className="p-2 hover:bg-gray-100 rounded-md cursor-pointer flex items-center">
                <Box size={14} className="mr-2" />
                <span>Duplicate Dashboard</span>
              </MenuItem>
              <MenuItem className="p-2 hover:bg-gray-100 rounded-md cursor-pointer flex items-center text-red-500">
                <AlertCircle size={14} className="mr-2" />
                <span>Delete Dashboard</span>
              </MenuItem>
              <MenuItem className="p-2 hover:bg-gray-100 rounded-md cursor-pointer flex items-center">
                <Download size={14} className="mr-2" />
                <span>Export Dashboard</span>
              </MenuItem>
            </Menu>
          </Dropdown>

          <Button
            variant="outlined"
            color="primary"
            onClick={onCancel}
            disabled={isLoading}
            className="mr-2"
            size="small"
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={onSave}
            disabled={isLoading}
            className="bg-teal-500 hover:bg-teal-600"
            size="small"
          >
            Save And Apply
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DeviceHeaderComponent;
