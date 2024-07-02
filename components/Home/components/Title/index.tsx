import {
  Typography,
  useMediaQuery,
  useTheme,
  TypographyProps,
} from "@mui/material";
import React from "react";

interface TitleProps extends TypographyProps {
  sx?: {
    mb?: number;
    [key: string]: any;
  };
}

const Title: React.FC<TitleProps> = ({
  variant = "h6",
  sx = {},
  children,
  ...props
}) => {
  // Access theme and define responsive variants
  const theme = useTheme();
  const responsiveVariants = {
    xs: "h6",
    sm: "h5",
    md: "h4",
    lg: "h3",
    xl: "h2",
  };

  // Determine the variant based on screen size
  const _variant = useMediaQuery(theme.breakpoints.down("sm"))
    ? responsiveVariants.xs
    : responsiveVariants.md;

  return (
    <Typography
      variant={_variant as any}
      sx={{
        ...sx,
        fontWeight: sx.fontWeight || 600,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
};

export default Title;
