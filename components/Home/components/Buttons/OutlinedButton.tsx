import { Button } from "@mui/material";
import React, { ReactNode } from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

interface OutlinedButtonProps {
  arrow?: boolean;
  children: ReactNode;
  fit?: boolean;
  sx?: any;
  [x: string]: any;
}

const OutlinedButton: React.FC<OutlinedButtonProps> = ({
  sx = {},
  arrow,
  children,
  fit,
  ...props
}) => {
  return (
    <Button
      variant="outlined"
      sx={{
        borderRadius: 2,
        color: "text.primary",
        borderColor: "text.primary",
        width: fit ? "fit-content" : "100%",
        ...sx,
      }}
      {...props}
    >
      {children}
      {arrow && <KeyboardArrowRightIcon fontSize="small" sx={{ ml: 0.5 }} />}
    </Button>
  );
};

export default OutlinedButton;
