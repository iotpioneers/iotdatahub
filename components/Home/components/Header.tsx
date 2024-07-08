"use client";

import { disablePageScroll, enablePageScroll } from "scroll-lock";

import { navigation } from "@/constants";
import Button from "./Button";
import MenuSvg from "./design/svg/MenuSvg";
import { HamburgerMenu } from "./design/Header";
import { useState } from "react";
import { WifiIcon } from "@heroicons/react/24/outline";
import NavigationMenuLinks from "../NavigationMenuLinks/NavigationMenuLinks";
import AvatarIcon from "../AvatarIcon";
import { useSession } from "next-auth/react";

const Header = () => {
  const { status, data: session } = useSession();
  const [openNavigation, setOpenNavigation] = useState(false);

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;

    enablePageScroll();
    setOpenNavigation(false);
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50  border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm ${
        openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        <a
          className="flex w-[12rem] xl:mr-8 gap-2 items-center text-gray-10 font-bold"
          href="/"
        >
          <WifiIcon className="animate-pulse h-8 w-8" aria-hidden="true" />
          <p>Ten2Ten</p>
        </a>

        <nav
          className={`${
            openNavigation ? "flex" : "hidden"
          } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}
        >
          <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
            <NavigationMenuLinks />
            {navigation.map((item) => (
              <a
                key={item.id}
                href={item.url}
                onClick={handleClick}
                className={`lg:hidden block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 ${
                  item.onlyMobile ? "lg:hidden" : ""
                } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold lg:text-n-1/50 lg:leading-5 lg:hover:text-n-1 xl:px-12`}
              >
                {item.title}
              </a>
            ))}{" "}
          </div>

          <HamburgerMenu />
        </nav>
        {status === "unauthenticated" && (
          <>
            <a
              href="/register"
              className="button hidden mr-4 ml-4 text-n-1/50 transition-colors hover:text-n-1 lg:block"
            >
              New account
            </a>
          </>
        )}

        {status === "authenticated" && <AvatarIcon />}
        <Button
          className="hidden lg:flex"
          href={status === "authenticated" ? "/dashboard" : "/login"}
        >
          {status === "authenticated" ? "Dashboard" : "Sign in"}
        </Button>

        <Button
          className="ml-auto lg:hidden"
          px="px-3"
          onClick={toggleNavigation}
        >
          <MenuSvg openNavigation={openNavigation} />
        </Button>
      </div>
    </div>
  );
};

export default Header;
