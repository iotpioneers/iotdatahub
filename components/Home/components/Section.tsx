import React, { ReactNode } from "react";
import SectionSvg from "./design/svg/SectionSvg";

type SectionProps = {
  className?: string;
  id?: string;
  crosses?: boolean;
  crossesOffset?: string;
  customPaddings?: boolean;
  children?: ReactNode;
};

const Section = ({ className, id, customPaddings, children }: SectionProps) => {
  return (
    <div
      id={id}
      className={`
        relative 
        ${customPaddings ? customPaddings : "py-10 lg:py-16 xl:py-20"} 
        ${className || ""}`}
    >
      {children}
    </div>
  );
};

export default Section;
