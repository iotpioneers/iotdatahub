import Image from "next/image";
import Button from "./Button";
import { Heading, Text } from "@radix-ui/themes";

const Hero = () => {
  return (
    <section className="max-container padding-container flex flex-col gap-20 py-10 pb-32 md:gap-28 lg:py-20 xl:flex-row">
      <div className="hero-map" />

      <div className="relative z-20 flex flex-1 flex-col xl:w-1/2">
        <Image
          src="/demo_dash_one.svg"
          alt="camp"
          width={50}
          height={50}
          className="absolute left-[-5px] top-[-30px] w-10 lg:w-[50px]"
        />
        <Heading className="bold-52 lg:bold-88">
          Harmony in Connectivity:
        </Heading>
        <Text className="regular-16 mt-6 text-gray-30 xl:max-w-[520px]">
          Bridging Devices, Empowering Lives
        </Text>

        <div className="my-11 flex flex-wrap gap-5">
          <div className="flex items-center gap-2">
            {Array(5)
              .fill(1)
              .map((_, index) => (
                <Image
                  src="/star.svg"
                  key={index}
                  alt="star"
                  width={24}
                  height={24}
                />
              ))}
          </div>

          <Text className="bold-16 lg:bold-20 text-blue-70">Join us</Text>
        </div>

        <div className="flex flex-col w-full gap-3 sm:flex-row">
          <Button type="button" title="Explore Tools" variant="btn_green" />
          <Button
            type="button"
            title="How we work?"
            icon="/play.svg"
            variant="btn_white_text"
          />
        </div>
      </div>

      <div className="relative flex flex-1 items-start">
        <div className="relative z-20 flex w-[268px] flex-col gap-8 rounded-3xl bg-green-90 px-7 py-8">
          <div className="flex flex-col">
            <div className="flexBetween">
              <Text className="regular-16 text-gray-20">Location</Text>
              <Image src="/close.svg" alt="close" width={24} height={24} />
            </div>
            <Text className="bold-20 text-white">Kigali - Rwanda</Text>
          </div>

          <div className="flex">
            <Text className="regular-16 block text-gray-20">
              Streamline your IoT device integration process with our Plug and
              Play solutions.
            </Text>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
