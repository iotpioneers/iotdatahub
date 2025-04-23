import Image from "next/image";
import Link from "next/link";
import React from "react";

export const Logo = () => {
  return (
    <Link href="/" className="flex p-1 text-orange-50">
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
