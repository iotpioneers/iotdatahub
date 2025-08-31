"use client";

import { motion } from "framer-motion";

export const LoadingBar = () => {
  return (
    <div className="w-full h-1 overflow-hidden bg-gray-200 dark:bg-gray-700 fixed top-0 left-0 z-50">
      <motion.div
        className="h-full bg-blue-500 dark:bg-blue-400"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
        style={{
          width: "50%",
        }}
      />
    </div>
  );
};
