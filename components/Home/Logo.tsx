import Link from "next/link";
import React from "react";

const Logo = () => {
  const logoStyle = {
    width: "140px",
    height: "auto",
    cursor: "pointer",
  };

  return (
    <Link
      href="/"
      className={`${logoStyle} grid py-2 justify-center items-center text-orange-50 px-2`}
    >
      <img
        src="./IOT_DATA_HUB.png"
        alt="logo"
        className="w-24 cursor-pointer"
      />
      <h1 className="flex text-lg text-center justify-center cursor-pointer font-bold">
        <span>IoTDataHub</span>
      </h1>
    </Link>
  );
};

export default Logo;
