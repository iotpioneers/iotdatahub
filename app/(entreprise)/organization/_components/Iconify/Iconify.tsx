import { forwardRef } from "react";
import { Icon as IconifyIcon } from "@iconify/react";
import Box from "@mui/material/Box";

interface IconifyProps {
  icon: string;
  width?: number;
  sx?: object;
  [key: string]: any;
}

const Iconify = forwardRef<HTMLDivElement, IconifyProps>(
  ({ icon, width = 20, sx, ...other }, ref) => (
    <Box
      ref={ref}
      className="component-iconify"
      sx={{ width, height: width, ...sx }}
      {...other}
    >
      <IconifyIcon icon={icon as string} width={width} height={width} />
    </Box>
  ),
);

export default Iconify;
