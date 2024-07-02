import React from "react";
import Link from "next/link";
import { Text } from "@radix-ui/themes";
import { WifiIcon } from "@heroicons/react/24/outline";
import AvatarIcon from "./AvatarIcon";
import MenuBar from "../MenuBar";
import NavigationMenuLinks from "./NavigationMenuLinks/NavigationMenuLinks";

const Navbar = () => {
  return (
    <nav className="w-full z-50 py-5 border-b bg-green-50 rounded-sm max-h-20 mb-5 px-5">
      <div className="flex items-center justify-between w-full">
        <div className="flex-shrink-0">
          <Link
            href="/"
            className="flex font-extrabold text-2xl text-white gap-1"
          >
            <WifiIcon className="h-8 w-8" aria-hidden="true" />
            <Text>Ten2Ten</Text>
          </Link>
        </div>

        <div className="flex-grow hidden h-full lg:flex justify-center">
          <NavigationMenuLinks />
        </div>

        <div className="flex-shrink-0 hidden lg:flex items-center">
          <AvatarIcon />
        </div>
      </div>
      <div className="">
        <MenuBar />
      </div>
    </nav>
  );
};

export default Navbar;
