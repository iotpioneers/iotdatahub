import { Theme as MuiTheme } from "@mui/material/styles";

interface ThemeColors {
  darkPaper?: string;
  primaryLight?: string;
  primaryMain?: string;
  primaryDark?: string;
  primary200?: string;
  primary800?: string;
  secondaryLight?: string;
  secondaryMain?: string;
  secondaryDark?: string;
  secondary200?: string;
  secondary800?: string;
  errorLight?: string;
  errorMain?: string;
  errorDark?: string;
  orangeLight?: string;
  orangeMain?: string;
  orangeDark?: string;
  warningLight?: string;
  warningMain?: string;
  warningDark?: string;
  successLight?: string;
  success200?: string;
  successMain?: string;
  successDark?: string;
  grey50?: string;
  grey100?: string;
  grey200?: string;
  grey300?: string;
  grey400?: string;
  grey500?: string;
  grey600?: string;
  grey700?: string;
  grey800?: string;
  grey900?: string;
  darkTextPrimary?: string;
  darkLevel1?: string;
  darkLevel2?: string;
  darkBackground?: string;
  darkPaper?: string;
  textDark?: string;
}

declare module "@mui/material/styles" {
  interface Theme {
    colors: ThemeColors;
    customization: {
      navType?: string;
      borderRadius: number;
      fontFamily: string;
    };
    typography: {
      customInput: object;
      pxToRem;
      fontWeightBold: string;
    };
    orange: {
      light: string;
      main: string;
      dark: string;
    };
    menuSelected: string;
    menuSelectedBack: string;
    grey500: string;
    textDark: string;
    darkTextPrimary: string;
    darkTextSecondary: string;
    divider: string;
    heading: string;
    paper: string;
    backgroundDefault: string;
    background: string;
  }

  interface ThemeOptions {
    colors?: ThemeColors;
    customization?: {
      borderRadius?: number;
      fontFamily?: string;
    };
    typography: {
      customInput?: object;
    };
    orange?: {
      light?: string;
      main?: string;
      dark?: string;
    };
    menuSelected?: string;
    menuSelectedBack?: string;
    textDark?: string;
    darkTextPrimary?: string;
    darkTextSecondary?: string;
    divider?: string;
    heading?: string;
    paper?: string;
    backgroundDefault?: string;
    background?: string;
  }
}
