"use client";

import { styled } from "@mui/system";
import LinearProgress from "@mui/material/LinearProgress";
import { Box } from "@mui/material";

const DisabledBackground = styled(Box)({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(204, 204, 204, 0.5)",
  zIndex: 999999,
  pointerEvents: "auto",
});

export const LinearLoading = () => (
  <DisabledBackground>
    <LinearProgress
      sx={{ position: "absolute", top: 0, left: 0, width: "100%" }}
    />
  </DisabledBackground>
);
