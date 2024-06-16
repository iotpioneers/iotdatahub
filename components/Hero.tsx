"use client";

import Image from "next/image";
import CustomButton from "./CustomButton";

const Hero = () => {
  const handleScroll = () => {};
  return (
    <div className="hero">
      <div className="flex-1 pt-36 padding-x">
        <h1 className="hero__title">
          Harmony in Connectivity: Bridging Devices, Empowering Lives
        </h1>
        <p className="hero__subtitle">
          Streamline your IoT device integration process with our Plug and Play
          solutions.
        </p>

        <CustomButton
          title="Explore Tools"
          containerStyles="bg-primary-blue text-white rounded-full mt-10"
          handleClick={handleScroll}
        />
      </div>
      <div className="hero__image-container">
        <div className="hero__image">
          <Image
            src="/demo_dash_one.svg"
            alt="hero"
            fill
            className="object-cover"
          />
        </div>
        {/* <div className="hero__image-overlay" /> */}
      </div>
    </div>
  );
};

export default Hero;
