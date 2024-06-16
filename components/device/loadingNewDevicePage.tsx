import { Box, Skeleton } from "@radix-ui/themes";
import React from "react";

const loadingNewDevicePage = () => {
  return (
    <Box className="max-w-xl">
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </Box>
  );
};

export default loadingNewDevicePage;
