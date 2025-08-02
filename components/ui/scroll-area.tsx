"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  scrollbarClassName?: string;
  thumbClassName?: string;
  orientation?: "vertical" | "horizontal";
  type?: "auto" | "always" | "scroll" | "hover";
  variant?: "default" | "primary" | "secondary" | "dark";
  children: React.ReactNode;
}

const variantClasses = {
  default: "bg-gray-200 dark:bg-gray-700",
  primary: "bg-primary-200 dark:bg-primary-700",
  secondary: "bg-secondary-200 dark:bg-secondary-700",
  dark: "bg-gray-800 dark:bg-gray-900",
};

const thumbVariantClasses = {
  default: "bg-gray-400 dark:bg-gray-500",
  primary: "bg-primary-500 dark:bg-primary-400",
  secondary: "bg-secondary-500 dark:bg-secondary-400",
  dark: "bg-gray-600 dark:bg-gray-400",
};

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    {
      className,
      scrollbarClassName,
      thumbClassName,
      orientation = "vertical",
      type = "hover",
      variant = "default",
      children,
      ...props
    },
    ref
  ) => {
    const [isScrolling, setIsScrolling] = React.useState(false);
    const [showScrollbar, setShowScrollbar] = React.useState(false);
    const scrollTimeoutRef = React.useRef<NodeJS.Timeout>(null);

    const handleScroll = () => {
      setIsScrolling(true);
      if (type === "hover") {
        setShowScrollbar(true);
      }
      clearTimeout(scrollTimeoutRef.current as NodeJS.Timeout);
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
        if (type === "hover") {
          setShowScrollbar(false);
        }
      }, 1000);
    };

    React.useEffect(() => {
      return () => {
        clearTimeout(scrollTimeoutRef.current as NodeJS.Timeout);
      };
    }, []);

    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden",
          className,
          type === "always" && "scrollbar-visible",
          type === "hover" && "scrollbar-hover"
        )}
        {...props}
      >
        <div
          className={cn(
            "h-full w-full overflow-auto",
            orientation === "vertical" ? "scrollbar-width" : "scrollbar-height",
            type === "hover" && "hover:overflow-auto"
          )}
          onScroll={handleScroll}
        >
          {children}
        </div>

        <AnimatePresence>
          {(type === "always" || showScrollbar || isScrolling) && (
            <motion.div
              className={cn(
                "absolute z-10 rounded-full",
                variantClasses[variant],
                scrollbarClassName,
                orientation === "vertical"
                  ? "w-2 right-1 top-0 h-full"
                  : "h-2 bottom-1 left-0 w-full"
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className={cn(
                  "rounded-full relative",
                  thumbVariantClasses[variant],
                  thumbClassName,
                  orientation === "vertical" ? "w-full" : "h-full"
                )}
                animate={{
                  opacity: isScrolling ? 1 : 0.7,
                  scaleX:
                    orientation === "vertical" ? 1 : isScrolling ? 1 : 0.9,
                  scaleY:
                    orientation === "horizontal" ? 1 : isScrolling ? 1 : 0.9,
                }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

ScrollArea.displayName = "ScrollArea";
