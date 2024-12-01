import { styled } from "@mui/system";
import LinearProgress from "@mui/material/LinearProgress";
import { Box } from "@mui/material";

export const LinearLoading = () => (
  <>
    <LinearProgress sx={{ zIndex: 2 }} />
    <DisabledBackground />
  </>
);

const DisabledBackground = styled(Box)({
  width: "100%",
  height: "100%",
  position: "fixed",
  background: "#ccc",
  opacity: 0.5,
  zIndex: 1,
});
