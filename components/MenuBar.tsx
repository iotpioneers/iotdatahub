"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Box, Button } from "@radix-ui/themes";
import Link from "next/link";
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
        <Image
          src="/menu.svg"
          alt="menu"
          width={32}
          height={32}
          className="inline-block cursor-pointer lg:hidden"
        />
      </button>

      <Dialog
        open={mobileMenuOpen}
        onClose={closeMenu}
        className="fixed inset-0 z-50 overflow-y-auto bg-white pt-5"
      >
        <Box className="absolute top-0 right-0 p-4">
          <Button type="button" onClick={closeMenu}>
            <XMarkIcon
              className="h-12 w-12 mb-2 ml-2 bg-zinc-500 border rounded-lg"
              aria-hidden="true"
            />
          </Button>
        </Box>

        <Dialog.Panel className="w-full mt-16 bg-white flex flex-col items-center justify-center">
          <Link
            href="#"
            className="flex items-center gap-6 pl-10 hover:bg-gray-200 p-4 rounded-md group cursor-pointer hover:shadow-lg w-full h-full"
          >
            <MdBusiness className="text-5xl text-gray-600 group-hover:text-gray-600" />
            <h3 className="text-2xl text-gray-800 group-hover:text-gray-600 font-bold">
              Enterprise
            </h3>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-6 pl-10 hover:bg-gray-200 p-4 rounded-md group cursor-pointer hover:shadow-lg w-full h-full"
          >
            <MdDeveloperBoard className="text-5xl text-gray-600 group-hover:text-gray-600" />
            <h3 className="text-2xl text-gray-800 group-hover:text-gray-600 font-bold">
              Developers
            </h3>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-6 pl-10 hover:bg-gray-200 p-4 rounded-md group cursor-pointer hover:shadow-lg w-full h-full"
          >
            <MdFeaturedPlayList className="text-5xl text-gray-600 group-hover:text-gray-600" />
            <h3 className="text-2xl text-gray-800 group-hover:text-gray-600 font-bold">
              Features
            </h3>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-6 pl-10 hover:bg-gray-200 p-4 rounded-md group cursor-pointer hover:shadow-lg w-full h-full"
          >
            <GiPriceTag className="text-5xl text-gray-600 group-hover:text-gray-600" />
            <h3 className="text-2xl text-gray-800 group-hover:text-gray-600 font-bold">
              Pricing
            </h3>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-6 pl-10 hover:bg-gray-200 p-4 rounded-md group cursor-pointer hover:shadow-lg w-full h-full"
          >
            <MdOutlineSpaceDashboard className="text-5xl text-gray-600 group-hover:text-gray-600" />
            <h3 className="text-2xl text-gray-800 group-hover:text-gray-600 font-bold">
              Dashboard
            </h3>
          </Link>
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

export default MenuBar;
