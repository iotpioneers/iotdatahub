import { PaletteOptions } from "@mui/material/styles";
import { CustomThemeProperties } from "./index";

export default function themePalette(
  theme: CustomThemeProperties
): PaletteOptions {
  return {
    mode: theme.customization?.navType || "light",
    common: {
      black: theme.colors?.darkPaper || "#000000",
    },
    primary: {
      light: theme.colors?.primaryLight || "#D1E9FC",
      main: theme.colors?.primaryMain || "#0A8AFB",
      dark: theme.colors?.primaryDark || "#0052CC",
      200: theme.colors?.primary200 || "#76B0F1",
      800: theme.colors?.primary800 || "#004CCE",
    },
    secondary: {
      light: theme.colors?.secondaryLight || "#D6E4FF",
      main: theme.colors?.secondaryMain || "#3366FF",
      dark: theme.colors?.secondaryDark || "#053e85",
      200: theme.colors?.secondary200 || "#BBD9FF",
      800: theme.colors?.secondary800 || "#0A0C0D",
    },
    error: {
      light: theme.colors?.errorLight || "#FF9797",
      main: theme.colors?.errorMain || "#FF3D71",
      dark: theme.colors?.errorDark || "#B72136",
    },
    orange: {
      light: theme.colors?.orangeLight || "#FEF0DA",
      main: theme.colors?.orangeMain || "#FFAB00",
      dark: theme.colors?.orangeDark || "#E08700",
    },
    warning: {
      light: theme.colors?.warningLight || "#FEF0DA",
      main: theme.colors?.warningMain || "#FFAB00",
      dark: theme.colors?.warningDark || "#E08700",
    },
    success: {
      light: theme.colors?.successLight || "#E9FCD4",
      200: theme.colors?.success200 || "#8BE78B",
      main: theme.colors?.successMain || "#22C55E",
      dark: theme.colors?.successDark || "#4DD0E1",
    },
    grey: {
      50: theme.colors?.grey50 || "#F3F6F9",
      100: theme.colors?.grey100 || "#E7EBF0",
      500: theme.colors?.grey500 || "#B2BAC2",
      600: theme.colors?.grey600 || "#6E7E91",
      700: theme.colors?.grey700 || "#3A5060",
      900: theme.colors?.grey900 || "#182224",
    },
    dark: {
      light: theme.colors?.darkTextPrimary || "#FCFCFC",
      main: theme.colors?.darkLevel1 || "#172B4D",
      dark: theme.colors?.darkLevel2 || "#0F2137",
      800: theme.colors?.darkBackground || "#10163A",
      900: theme.colors?.darkPaper || "#0A0F2C",
    },
    text: {
      primary: theme.darkTextPrimary || "#B2BAC2",
      secondary: theme.darkTextSecondary || "#B9B9B9",
    },
    background: {
      paper: theme.paper || "#FFFFFF",
      default: theme.backgroundDefault || "#F7F8FA",
    },
  };
}
