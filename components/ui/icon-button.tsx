"use client";

import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "./button";
import { motion } from "framer-motion";

interface IconButtonProps extends ButtonProps {
  icon: React.ReactNode;
  tooltip?: string;
}

export const IconButton = ({
  icon,
  tooltip,
  className,
  ...props
}: IconButtonProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative"
    >
      <Button
        variant="ghost"
        size="icon"
        className={cn("rounded-full", className)}
        {...props}
      >
        {icon}
        {tooltip && (
          <motion.span
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
          >
            {tooltip}
          </motion.span>
        )}
      </Button>
    </motion.div>
  );
};
