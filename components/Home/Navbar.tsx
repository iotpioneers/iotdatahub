import { NAV_LINKS } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { Text } from "@radix-ui/themes";
import { WifiIcon } from "@heroicons/react/24/outline";
import SigninButton from "./SigninButton";

const Navbar = () => {
  return (
    <nav className="flexBetween max-container padding-container relative z-30 py-5">
      <Link href="/" className="flex font-bold text-red-800">
        <WifiIcon className="h-6 w-6 mx-3" aria-hidden="true" />
        <Text>Ten2Ten</Text>
      </Link>

      <ul className="hidden h-full gap-12 lg:flex">
        {NAV_LINKS.map((link) => (
          <Link
            href={link.href}
            key={link.key}
            className="regular-16 text-gray-50 flexCenter cursor-pointer pb-1.5 transition-all hover:font-bold"
          >
            {link.label}
          </Link>
        ))}
      </ul>

      <div className="lg:flexCenter hidden">
        <SigninButton />
      </div>

      <Image
        src="menu.svg"
        alt="menu"
        width={32}
        height={32}
        className="inline-block cursor-pointer lg:hidden"
      />
    </nav>
  );
};

export default Navbar;
