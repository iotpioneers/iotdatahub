import Image from "next/image";
import Link from "next/link";
import React from "react";

export const Logo = () => {
  return (
    <Link
      href="/"
      className="grid py-2 justify-center items-center text-orange-50 px-2"
    >
      <Image
        src="/IOT_DATA_HUB.png"
        alt="logo"
        width={96}
        height={96}
        className="cursor-pointer"
      />
      <h1 className="flex text-lg text-center justify-center cursor-pointer font-bold">
        <span>IoTDataHub</span>
      </h1>
    </Link>
  );
};
