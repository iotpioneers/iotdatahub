import React from "react";
import Link from "next/link";
import { Text } from "@radix-ui/themes";
import { WifiIcon } from "@heroicons/react/24/outline";
import AvatarIcon from "./AvatarIcon";
import MenuBar from "../MenuBar";
import NavigationMenuLinks from "./NavigationMenuLinks/NavigationMenuLinks";

const Navbar = () => {
  return (
    <nav className="flexBetween max-container padding-container relative z-30 py-5 border-b navbar bg-green-50 rounded-sm max-h-16">
      <div className="flex justify-center items-center">
        <Link
          href="/"
          className="flex font-extrabold text-2xl text-white gap-1"
        >
          <WifiIcon className="h-8 w-8" aria-hidden="true" />
          <Text>Ten2Ten</Text>
        </Link>

        <div className="hidden h-full lg:flex">
          <NavigationMenuLinks />
        </div>

        <div className="hidden lg:flex items-center -ml-80">
          <AvatarIcon />
        </div>
      </div>

      <MenuBar />
    </nav>
  );
};

export default Navbar;
