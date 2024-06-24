import { Box } from "@radix-ui/themes";
import React from "react";
import Skeleton from "./Skeleton";

const LoadingSkeleton = () => {
  return (
    <Box className="mx-5 max-w-xl">
      <Skeleton height="2rem" />
      <Skeleton height="20rem" />
    </Box>
  );
};

export default LoadingSkeleton;
