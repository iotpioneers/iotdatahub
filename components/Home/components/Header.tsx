"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { navigation } from "@/constants";
import Button from "./Button";
import MenuSvg from "./design/svg/MenuSvg";
import { HamburgerMenu } from "./design/Header";
import NavigationMenuLinks from "../NavigationMenuLinks/NavigationMenuLinks";
import AvatarIcon from "../AvatarIcon";

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
      className={`fixed top-0 left-0 w-full z-10  border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm ${
        openNavigation ? "bg-n-10" : "bg-n-6/5 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center px-1 sm:px-5  lg:px-7.5 xl:px-10 max-lg:py-4">
        <div className="flex w-full justify-between items-center">
          <div className="ml-1 xs:ml-5">
            <a
              className="block justify-center md:w-[12rem] xl:mr-8 gap-2 items-center text-gray-10 font-bold"
              href="/"
            >
              <div className="flex items-center">
                <img
                  src="logo.svg"
                  alt="logo"
                  className="h-8 w-8 float-left float mr-2"
                  color="white"
                />
                <p className="text-slate-600">IoTDataCenter</p>
              </div>
            </a>
          </div>
          <div className="flex items-center gap-0 md:gap-2">
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
                ))}
              </div>

              <HamburgerMenu />
            </nav>

            <a
              href="/register"
              className="button hidden ml-8 text-green-500 transition-colors hover:text-n-1 lg:block"
            >
              SIGN UP
            </a>

            {status !== "loading" && (
              <Button
                className="flex -mr-4 xs:mr-1 "
                href={status === "authenticated" ? "/dashboard" : "/login"}
              >
                {status === "authenticated" ? "DASHBOARD" : "SIGN IN"}
              </Button>
            )}
            {status === "authenticated" && <AvatarIcon />}

            <Button
              className="ml-1 lg:hidden"
              px="px-3"
              onClick={toggleNavigation}
            >
              <MenuSvg openNavigation={openNavigation} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
