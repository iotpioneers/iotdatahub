"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const MenuBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        onClose={() => setMobileMenuOpen(false)}
        className="fixed inset-0 z-50 overflow-y-auto bg-white"
      >
        <Dialog.Panel className="absolute top-0 right-0 p-4">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 text-gray-700"
          >
            <span className="sr-only">Close menu</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </Dialog.Panel>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <ul className="space-y-4">
            <li>
              <a href="#" className="text-gray-900">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-900">
                About
              </a>
            </li>
            {/* Add more menu items */}
          </ul>
        </div>
      </Dialog>
    </>
  );
};

export default MenuBar;
