"use client";

import Button from "./Button";
import Section from "./Section";
import { BackgroundCircles, BottomLine, Gradient } from "./design/Hero";
import { heroIcons } from "@/constants";
import { ScrollParallax } from "react-just-parallax";
import { useRef } from "react";
import Generating from "./Generating";
import Notification from "./Notification";

const Hero = () => {
  const parallaxRef = useRef(null);

  return (
    <Section
      className="pt-[12rem] lg:-mt-[9.25rem] md:mt-[1.25rem] xs:-mt-[5.25rem] -mt-[12.25rem] bg-slate-200 lg:max-h-screen"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="hero"
    >
      <div className="container relative lg:mt-36" ref={parallaxRef}>
        <div className="lg:flex md:grid lg:mt-12 xs:mt-1">
          <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] xs:-mt-28 md:mb-20 lg:mb-[6.25rem]">
            <h1 className="h1 mb-2 text-gray-50">
              Cutt edge with{"  "}
              <span className="inline-block relative">
                ARTISAN{" "}
                <img
                  src="hero/curve.png"
                  className="absolute top-full left-0 w-full xl:-mt-2"
                  width={624}
                  height={28}
                  alt="Curve"
                />
              </span>
              {"  "}for&nbsp;seamless and efficient&nbsp; IoT Plug and Play
              services {` `}
            </h1>
            <Button href="/pricing" white>
              Get started
            </Button>
          </div>
          <div className="relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-20 xs:-mt-10 lg:-mt-24">
            <div className="relative z-1 p-0.5 rounded-2xl bg-conic-gradient">
              <div className="relative bg-n-8 rounded-[1rem]">
                <div className="h-[1.4rem] bg-n-10 rounded-t-[0.9rem]" />

                <div className="aspect-[33/40] rounded-b-[0.9rem] overflow-hidden md:aspect-[688/490] lg:aspect-[1024/490]">
                  <img
                    src="hero/home.jpg"
                    className="w-full scale-[1.7] translate-y-[8%] md:scale-[1] md:-translate-y-[10%] lg:-translate-y-[23%]"
                    width={1024}
                    height={490}
                    alt="hero_bg_image"
                  />

                  <Generating className="brainabsolute left-4 right-4 bottom-5 md:left-1/2 md:right-auto md:bottom-8 md:w-[31rem] md:-translate-x-1/2" />

                  <ScrollParallax isAbsolutelyPositioned>
                    <Notification
                      className="hidden absolute -right-[5.5rem] bottom-[11rem] w-[18rem] xl:flex"
                      title="Link devices"
                    />
                  </ScrollParallax>
                </div>
              </div>

              <Gradient />
            </div>
            <div className="absolute -top-[54%] left-1/2 w-[234%] -translate-x-1/2 md:-top-[46%] md:w-[138%] lg:-top-[104%]">
              <div className="w-full bg-white"></div>
            </div>

            <BackgroundCircles parallaxRef={parallaxRef} />
          </div>
        </div>
      </div>

      <BottomLine />
    </Section>
  );
};

export default Hero;
