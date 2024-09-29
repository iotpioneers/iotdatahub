import * as React from "react";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ToggleColorMode from "./components/ToggleColorMode";
import getDashboardTheme from "./theme/getDashboardTheme";
import { HomeIcon } from "lucide-react";
import Logo from "../Home/Logo";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: "fixed",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderBottom: "1px solid",
  borderColor: theme.palette.divider,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  backgroundImage: "none",
  padding: 4,
  zIndex: theme.zIndex.drawer + 1,
}));

interface NavBarProps {
  showCustomTheme: boolean;
  toggleCustomTheme: (theme: boolean) => void;
  mode: PaletteMode;
  toggleColorMode: () => void;
}

export default function NavBar({
  showCustomTheme,
  toggleCustomTheme,
  mode,
  toggleColorMode,
}: NavBarProps) {
  const handleChange = (event: SelectChangeEvent) => {
    toggleCustomTheme(event.target.value === "custom");
  };
  const dashboardTheme = createTheme(getDashboardTheme(mode));

  return (
    <ThemeProvider theme={dashboardTheme}>
      <StyledAppBar>
        <Container maxWidth="lg">
          <Toolbar
            variant="dense"
            disableGutters
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Logo />
          </Toolbar>
        </Container>
      </StyledAppBar>
    </ThemeProvider>
  );
}
