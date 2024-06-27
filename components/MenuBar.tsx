"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import NavigationMenuLinks from "./Home/NavigationMenuLinks/NavigationMenuLinks";
import AvatarIcon from "./Home/AvatarIcon";
import { Box, Button, Flex } from "@radix-ui/themes";

const MenuBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => {
    console.log("Closed");
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
        onClose={() => {}} // Prevent closing by default
        className="fixed inset-0 z-50 overflow-y-auto bg-white pt-5"
      >
        <Button type="button" onClick={closeMenu}>
          <XMarkIcon
            className="h-12 w-12 ml-2 bg-zinc-500 border rounded-lg"
            aria-hidden="true"
          />
        </Button>

        <Dialog.Panel className="w-full h-screen md:-mt-12 bg-white">
          <NavigationMenuLinks />
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

export default MenuBar;
