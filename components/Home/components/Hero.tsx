"use client";

import { useRef } from "react";
import { ScrollParallax } from "react-just-parallax";
import Image from "next/image";
import styled from "styled-components";
import Button from "./Button";
import Section from "./Section";
import Notification from "./Notification";
import hover3d from "@/app/utils/hover";

const Hero = () => {
  const hero = useRef<HTMLDivElement>(null);

  const hoverHero = hover3d(hero, {
    x: 30,
    y: -40,
    z: 30,
  });

  const imageHover = hover3d(hero, {
    x: 20,
    y: -5,
    z: 11,
  });
  const parallaxRef = useRef(null);

  return (
    <HeaderStyled ref={hero}>
      <Section
        className="pt-[12rem] lg:-mt-[9.25rem] md:mt-[1.25rem] xs:-mt-[5.25rem] -mt-[12.25rem] bg-slate-200 lg:max-h-screen"
        crosses
        crossesOffset="lg:translate-y-[5.25rem]"
        customPaddings
        id="hero"
      >
        <div className="container relative lg:mt-36" ref={parallaxRef}>
          <div className="lg:flex md:grid lg:mt-12 xs:mt-1">
            <ScrollParallax isAbsolutelyPositioned>
              <Notification
                className="hidden absolute -right-[5.5rem] bottom-[11rem] w-[18rem] xl:flex"
                title="Link devices"
              />
            </ScrollParallax>
            <div className="relative z-1 max-w-[42rem] mx-auto text-center mb-[3.875rem] xs:-mt-28 md:mb-20 lg:mb-[6.25rem]">
              <h1 className="h1 mb-2 text-gray-50">
                Cutt edge with
                <span className="inline-block relative">
                  {" "}
                  IoTDataHub{" "}
                  <img
                    src="hero/curve.png"
                    className="absolute top-full left-0 w-full xl:-mt-2"
                    width={624}
                    height={28}
                    alt="Curve"
                  />
                </span>
                for&nbsp;seamless and efficient&nbsp; IoT Plug and Play services{" "}
              </h1>
              <Button href="/pricing" white>
                Get started
              </Button>
            </div>
            <div className="image-content">
              <div
                className="image"
                style={{
                  transform: hoverHero.transform,
                }}
              >
                <div className="relative max-w-[40rem] mx-auto md:max-w-5xl xl:mb-20 xs:-mt-10 lg:-mt-24">
                  <div className="relative z-1 p-0.5 rounded-2xl bg-conic-gradient">
                    <div className="aspect-[33/40] rounded-[0.9rem] overflow-hidden md:aspect-[688/490] lg:aspect-[1024/490]">
                      <Image
                        src="/hero/home.jpg"
                        width={600}
                        height={600}
                        alt="hero"
                        style={{
                          transform: imageHover.transform,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </HeaderStyled>
  );
};

const HeaderStyled = styled.header`
    .image-content .image {
      padding: 1rem;
      border-radius: 8px;
      background-color: var(--color-bg);
      border: 1px solid var(--color-border);
    }
  }
`;

export default Hero;
