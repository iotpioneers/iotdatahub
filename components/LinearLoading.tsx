import { styled } from "@mui/system";
import LinearProgress from "@mui/material/LinearProgress";
import { Box } from "@mui/material";

export const LinearLoading = () => (
  <>
    <LinearProgress sx={{ zIndex: 2 }} />
    <DisabledBackground />
  </>
);

export const DisabledBackground = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "#ccc",
  opacity: 0.5,
  zIndex: 1,
});
