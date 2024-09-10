import * as React from "react";

// Third party
import styled from "styled-components";
import Box from "@mui/material/Box";
import { Heading } from "@radix-ui/themes";

// Project imports
import { benefits } from "@/constants";
import Section from "../components/Section";
import Arrow from "../components/design/svg/Arrow";
import { GradientLight } from "../components/design/Benefits";
import ClipPath from "../components/design/svg/ClipPath";
import HorizontalWrapper from "../components/HorizontalWrapper";

const Benefits = () => {
  return (
    <Section>
      <Box
        id="features"
        sx={(theme) => ({
          width: "100%",
          backgroundImage:
            theme.palette.mode === "light"
              ? "linear-gradient(180deg, #CEE5FD, #FFF)"
              : `linear-gradient(180deg, #011010, #000)",
                  0.0
                )})`,
          backgroundSize: "100% 20%",
          backgroundRepeat: "no-repeat",
          p: { sm: "1rem", md: "2rem" },
        })}
      >
        <div className="container relative z-2">
          <Heading
            className="md:max-w-md lg:max-w-2xl"
            title="Manage Devices"
          />

          <BenefitsStyled>
            <HorizontalWrapper height="20rem" direction={-2200}>
              <div className="cards">
                {benefits.map((item) => (
                  <div
                    className="block relative p-0.5 bg-no-repeat bg-[length:100%_100%] md:max-w-[24rem]"
                    style={{
                      backgroundImage: `url(${item.backgroundUrl})`,
                    }}
                    key={item.id}
                  >
                    <div className="relative z-2 flex flex-col min-h-[22rem] p-[2.4rem] pointer-events-none">
                      <h3 className="h3 text-2xl font-bold text-red-200 mb-5">
                        {item.title}
                      </h3>
                      <p className="body-2 text-lg font-bold mb-6 text-n-1">
                        {item.text}
                      </p>
                      <div className="flex items-center mt-auto">
                        <img
                          src={item.iconUrl}
                          width={48}
                          height={48}
                          alt={item.title}
                        />
                        <p className="ml-auto font-code text-xs font-bold text-n-1 uppercase tracking-wider">
                          Explore more
                        </p>
                        <Arrow />
                      </div>
                    </div>

                    {item.light && <GradientLight />}

                    <div
                      className="absolute inset-0.5 bg-n-6"
                      style={{ clipPath: "url(#benefits)" }}
                    >
                      <div className="absolute inset-0 opacity-15 transition-opacity hover:opacity-60">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            width={380}
                            height={362}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </div>

                    <ClipPath />
                  </div>
                ))}
              </div>
            </HorizontalWrapper>
          </BenefitsStyled>
        </div>
      </Box>
    </Section>
  );
};

const BenefitsStyled = styled.main`
  .cards {
    position: absolute;
    display: grid;
    grid-template-columns: repeat(5, 30rem);
    gap: 2rem;
    overflow-x: auto;
  }
`;

export default Benefits;
