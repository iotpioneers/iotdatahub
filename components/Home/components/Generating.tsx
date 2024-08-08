import React from "react";

type GeneratingProps = {
  className?: string;
};

const Generating = ({ className }: GeneratingProps) => {
  return (
    <div
      className={`flex items-center h-[3.5rem] px-6 bg-n-8/80 text-white rounded-[1.7rem] ${
        className || ""
      } text-base`}
    >
      <img className="w-5 h-5 mr-4" src="loading.png" alt="Loading" />
      Let's build brighter future with IoTDataHub
    </div>
  );
};

export default Generating;
