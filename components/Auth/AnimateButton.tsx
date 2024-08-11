import PropTypes from "prop-types";
import React, { ForwardedRef } from "react";
import { motion, useCycle } from "framer-motion";

// Define the prop types for the component
interface AnimateButtonProps {
  children: React.ReactNode;
  type?: "slide" | "scale" | "rotate";
  direction?: "up" | "down" | "left" | "right";
  offset?: number;
  scale?: number | { hover: number; tap: number };
}

// ==============================|| ANIMATION BUTTON ||============================== //

const AnimateButton = React.forwardRef<HTMLDivElement, AnimateButtonProps>(
  (
    {
      children,
      type = "scale",
      offset = 10,
      direction = "right",
      scale = {
        hover: 1,
        tap: 0.9,
      },
    },
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    let offset1: number;
    let offset2: number;

    switch (direction) {
      case "up":
      case "left":
        offset1 = offset ?? 0;
        offset2 = 0;
        break;
      case "right":
      case "down":
      default:
        offset1 = 0;
        offset2 = offset ?? 0;
        break;
    }

    const [x, cycleX] = useCycle(offset1, offset2);
    const [y, cycleY] = useCycle(offset1, offset2);

    switch (type) {
      case "rotate":
        return (
          <motion.div
            ref={ref}
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 2,
              repeatDelay: 0,
            }}
          >
            {children}
          </motion.div>
        );
      case "slide":
        if (direction === "up" || direction === "down") {
          return (
            <motion.div
              ref={ref}
              animate={{ y }}
              onHoverEnd={() => cycleY()}
              onHoverStart={() => cycleY()}
            >
              {children}
            </motion.div>
          );
        }
        return (
          <motion.div
            ref={ref}
            animate={{ x }}
            onHoverEnd={() => cycleX()}
            onHoverStart={() => cycleX()}
          >
            {children}
          </motion.div>
        );

      case "scale":
      default:
        const scaleProps =
          typeof scale === "number" ? { hover: scale, tap: scale } : scale;

        return (
          <motion.div
            ref={ref}
            whileHover={{ scale: scaleProps?.hover }}
            whileTap={{ scale: scaleProps?.tap }}
          >
            {children}
          </motion.div>
        );
    }
  }
);

AnimateButton.propTypes = {
  children: PropTypes.node.isRequired,
  offset: PropTypes.number,
  type: PropTypes.oneOf(["slide", "scale", "rotate"]),
  direction: PropTypes.oneOf(["up", "down", "left", "right"]),
  scale: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      hover: PropTypes.number.isRequired,
      tap: PropTypes.number.isRequired,
    }),
  ]),
};

export default AnimateButton;
