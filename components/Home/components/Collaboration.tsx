import { collabContent, collabText } from "@/constants";
import Button from "./Button";
import Section from "./Section";
import { LeftCurve, RightCurve } from "./design/Collaboration";
import styled from "styled-components";
import { motion, useScroll, useTransform } from "framer-motion";
import React from "react";

const Collaboration = () => {
  const secRef = React.useRef<HTMLDivElement>(null);

  // ScrollYProgress is a value between 0 and 1
  const { scrollYProgress } = useScroll({
    //target is the element that we want to track
    target: secRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const xTransform = useTransform(
    scrollYProgress,
    [1, 0.5, 0.1, 0],
    [-1000, 0, 0, 0]
  );

  return (
    <Section crosses>
      <CollaborationpageStyled>
        <motion.div
          className="collaboration"
          style={{
            scale: scale,
            x: xTransform,
          }}
        >
          <div className="container lg:flex">
            <div className="max-w-[25rem]">
              <h2 className="h2 mb-4 md:mb-8">Collaboration with your team</h2>

              <ul className="max-w-[22rem] mb-10 md:mb-14">
                {collabContent.map((item) => (
                  <li className="mb-3 py-3" key={item.id}>
                    <div className="flex items-center">
                      <img src="check.svg" width={24} height={24} alt="check" />
                      <h6 className="body-2 ml-5">{item.title}</h6>
                    </div>
                    {item.text && (
                      <p className="body-2 mt-3 text-n-4">{item.text}</p>
                    )}
                  </li>
                ))}
              </ul>

              <Button className="text-n-4">Try it now</Button>
            </div>

            <div className="lg:ml-auto xl:w-[38rem] mt-4">
              <p className="body-2 mb-8 text-n-4 md:mb-16 lg:mb-32 lg:w-[22rem] lg:mx-auto">
                {collabText}
              </p>

              <div className="relative left-1/2 flex w-[22rem] aspect-square border border-n-6 rounded-full -translate-x-1/2 scale:75 md:scale-100">
                <img
                  src="collaboration/representation-user-experience-interface-design_23-2150169866.avif"
                  alt="representation-user-experience-interface-design"
                  className="rounded-md"
                />

                <LeftCurve />
                <RightCurve />
              </div>
            </div>
          </div>
        </motion.div>
      </CollaborationpageStyled>
    </Section>
  );
};

const CollaborationpageStyled = styled.div`
  .collaboration {
    width: calc(100% - 1rem);
    position: relative;
    border-radius: 1rem;
    border-radius: 8px;

    border: 1px solid var(--color-border);
    transition: border 0.3s ease-in-out;

    &:hover {
      border: 1px solid #f2994a;
    }
  }
`;

export default Collaboration;
