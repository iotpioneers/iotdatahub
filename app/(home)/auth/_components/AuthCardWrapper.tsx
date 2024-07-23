import React from "react";
import Box from "@mui/material/Box";
import MainCard from "./MainCard";

// Define the props for AuthCardWrapper
interface AuthCardWrapperProps {
  children: React.ReactNode;
  [key: string]: any;
}

// Define the AuthCardWrapper component
const AuthCardWrapper: React.FC<AuthCardWrapperProps> = ({
  children,
  ...other
}) => (
  <MainCard
    sx={{
      maxWidth: { xs: 400, lg: 475 } as React.CSSProperties["maxWidth"],
      margin: { xs: 2.5, md: 3 },
      "& > *": {
        flexGrow: 1,
        flexBasis: "50%",
      },
    }}
    content={false}
    {...other}
  >
    <Box sx={{ p: { xs: 2, sm: 3, xl: 5 } }}>{children}</Box>
  </MainCard>
);

export default AuthCardWrapper;
