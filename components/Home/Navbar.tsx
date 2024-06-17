import { NAV_LINKS } from "@/constants";
import Link from "next/link";
import { Button, DropdownMenu, Text } from "@radix-ui/themes";
import { WifiIcon } from "@heroicons/react/24/outline";
import SigninButton from "./SigninButton";
import MenuBar from "../MenuBar";

const Navbar = () => {
  return (
    <nav className="flexBetween max-container padding-container relative z-30 py-5 x-3 border-b navbar bg-green-50 rounded-sm max-h-16">
      <Link href="/" className="flex font-extrabold text-2xl text-white">
        <WifiIcon className="h-8 w-8 mx-3" aria-hidden="true" />
        <Text>Ten2Ten</Text>
      </Link>

      <ul className="hidden h-full gap-12 lg:flex">
        {NAV_LINKS.map((link) => (
          <Link
            href={link.href}
            key={link.key}
            className="regular-16 text-white flexCenter cursor-pointer pb-1.5 transition-all hover:font-bold"
          >
            {link.label}
          </Link>
        ))}
      </ul>

      <div className="lg:flexCenter hidden">
        <SigninButton />
      </div>

      <MenuBar />
    </nav>
  );
};

export default Navbar;
