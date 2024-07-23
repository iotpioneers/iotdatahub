import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

// Define the props for the MainCard component
interface MainCardProps {
  border?: boolean;
  boxShadow?: boolean;
  children?: React.ReactNode;
  content?: boolean;
  contentClass?: string;
  contentSX?: React.CSSProperties;
  darkTitle?: boolean;
  secondary?: React.ReactNode;
  shadow?: string | number;
  sx?: React.CSSProperties;
  title?: React.ReactNode;
}

// Define the MainCard component
const MainCard = React.forwardRef<HTMLDivElement, MainCardProps>(
  (
    {
      border = false,
      boxShadow,
      children,
      content = true,
      contentClass = "",
      contentSX = {},
      darkTitle,
      secondary,
      shadow,
      sx = {},
      title,
      ...others
    },
    ref
  ) => {
    return (
      <Card
        ref={ref}
        {...others}
        sx={{
          border: border ? "1px solid" : "none",
          borderColor: "divider",
          ":hover": {
            boxShadow: boxShadow
              ? shadow || "0 2px 14px 0 rgb(32 40 45 / 8%)"
              : "inherit",
          },
          ...sx,
        }}
      >
        {/* Card header and action */}
        {!darkTitle && title && (
          <CardHeader
            sx={{ "& .MuiCardHeader-action": { mr: 0 } }}
            title={title}
            action={secondary}
          />
        )}
        {darkTitle && title && (
          <CardHeader
            sx={{ "& .MuiCardHeader-action": { mr: 0 } }}
            title={<Typography variant="h3">{title}</Typography>}
            action={secondary}
          />
        )}

        {/* Content & header divider */}
        {title && <Divider />}

        {/* Card content */}
        {content && (
          <CardContent sx={contentSX} className={contentClass}>
            {children}
          </CardContent>
        )}
        {!content && children}
      </Card>
    );
  }
);

export default MainCard;
