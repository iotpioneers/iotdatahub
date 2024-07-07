"use client";

import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Box, Button } from "@radix-ui/themes";
import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import {
  MdOutlineSpaceDashboard,
  MdDeveloperBoard,
  MdBusiness,
  MdFeaturedPlayList,
} from "react-icons/md";
import { GiPriceTag } from "react-icons/gi";

const MenuBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <button className="lg:hidden" onClick={() => setMobileMenuOpen(true)}>
        <IconButton>
          <MenuIcon sx={{ color: "text.secondary" }} />
        </IconButton>
      </button>

      <Dialog
        open={mobileMenuOpen}
        onClose={closeMenu}
        className="fixed inset-0 z-50 overflow-y-auto bg-slate-800 pt-5"
      >
        <Box className="absolute top-0 right-0 p-4">
          <Button type="button" onClick={closeMenu}>
            <IconButton>
              <CloseIcon sx={{ color: "text.primary" }} />
            </IconButton>
          </Button>
        </Box>

        <Dialog.Panel className="w-full mt-16 flex flex-col items-center justify-center">
          <Link
            href="#"
            className="flex items-center gap-6 pl-10 hover:bg-gray-200 p-4 rounded-md group cursor-pointer hover:shadow-lg w-full h-full"
          >
            <MdBusiness className="text-5xl text-white group-hover:text-gray-600" />
            <h3 className="text-2xl text-white group-hover:text-gray-600 font-bold">
              Enterprise
            </h3>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-6 pl-10 hover:bg-gray-200 p-4 rounded-md group cursor-pointer hover:shadow-lg w-full h-full"
          >
            <MdDeveloperBoard className="text-5xl text-white group-hover:text-gray-600" />
            <h3 className="text-2xl text-white group-hover:text-gray-600 font-bold">
              Developers
            </h3>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-6 pl-10 hover:bg-gray-200 p-4 rounded-md group cursor-pointer hover:shadow-lg w-full h-full"
          >
            <MdFeaturedPlayList className="text-5xl text-white group-hover:text-gray-600" />
            <h3 className="text-2xl text-white group-hover:text-gray-600 font-bold">
              Features
            </h3>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-6 pl-10 hover:bg-gray-200 p-4 rounded-md group cursor-pointer hover:shadow-lg w-full h-full"
          >
            <GiPriceTag className="text-5xl text-white group-hover:text-gray-600" />
            <h3 className="text-2xl text-white group-hover:text-gray-600 font-bold">
              Pricing
            </h3>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-6 pl-10 hover:bg-gray-200 p-4 rounded-md group cursor-pointer hover:shadow-lg w-full h-full"
          >
            <MdOutlineSpaceDashboard className="text-5xl text-white group-hover:text-gray-600" />
            <h3 className="text-2xl text-white group-hover:text-gray-600 font-bold">
              Dashboard
            </h3>
          </Link>
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

export default MenuBar;
