"use client";

import React from "react";
import styled from "styled-components";
import { motion, useScroll, useTransform } from "framer-motion";

interface Props {
  children: React.ReactNode;
}

const TextWrapper = ({ children }: Props) => {
  const text = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: text,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [1, 0.8, 0], [1, 1, 0]);
  const x = useTransform(scrollYProgress, [1, 0.4, 0], [0, 0, -1000]);
  const colorChange = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [
      "hsla(180, 7%, 75%, 0.9)",
      "hsla(180, 7%, 75%, 0.9)",
      "#f2994a",
      "#f2994a",
      "#f2994a",
      "#f2994a",
    ]
  );

  return (
    <div ref={text}>
      <motion.p style={{ opacity, x, color: colorChange }}>{children}</motion.p>
    </div>
  );
};

const ActionsSection = () => {
  return (
    <section
      style={{
        padding: "5rem",
      }}
    >
      <ActionSectionStyled>
        <TextWrapper>
          Our platform seamlessly connects your IoT devices, providing real-time
          control and monitoring through an intuitive interface.
        </TextWrapper>
        <TextWrapper>
          Experience the power of data visualization with our comprehensive
          analytics tools, turning raw data into actionable insights.
        </TextWrapper>
        <TextWrapper>
          Secure and reliable cloud storage ensures your data is always
          available when you need it, with robust security protocols protecting
          your information.
        </TextWrapper>
        <TextWrapper>
          Customize your dashboard with a variety of widgets to suit your
          specific needs, giving you full control over your IoT environment.
        </TextWrapper>
        <TextWrapper>
          Our platform supports a wide range of devices, ensuring compatibility
          and ease of integration with your existing hardware.
        </TextWrapper>
        <TextWrapper>
          Enhance your IoT projects with our advanced automation features,
          allowing you to create smart, responsive systems with minimal effort.
        </TextWrapper>
        <TextWrapper>
          Join a community of innovators and developers, sharing ideas and
          solutions to drive the future of IoT technology forward.
        </TextWrapper>
      </ActionSectionStyled>
    </section>
  );
};

const ActionSectionStyled = styled.section`
  p {
    font-size: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2rem;
    margin: 1rem;
  }
`;

export default ActionsSection;
