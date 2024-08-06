// material-ui
import { createTheme, ThemeOptions, Theme } from "@mui/material/styles";

// assets
import colors from "@/app/styles/scss/_themes-vars.module.scss";

// project imports
import componentStyleOverrides from "./compStyleOverride";
import themePalette from "./palette";
import themeTypography from "./typography";

/**
 * Represent theme style and structure as per Material-UI
 * @param {Customization} customization customization parameter object
 */

interface Customization {
  borderRadius: number;
  fontFamily: string;
  navType: "light" | "dark";
}

export interface CustomThemeProperties {
  colors: typeof colors;
  heading: string;
  paper: string;
  grey500?: string;
  backgroundDefault: string;
  background: string;
  darkTextPrimary: string;
  darkTextSecondary: string;
  textDark: string;
  menuSelected: string;
  menuSelectedBack: string;
  divider: string;
  customization: Customization;
}

const theme = (customization: Customization) => {
  const customThemeProperties: CustomThemeProperties = {
    colors: colors,
    heading: colors.grey900,
    paper: colors.paper,
    backgroundDefault: colors.paper,
    background: colors.primaryLight,
    darkTextPrimary: colors.grey700,
    darkTextSecondary: colors.grey500,
    textDark: colors.grey900,
    menuSelected: colors.secondaryDark,
    menuSelectedBack: colors.secondaryLight,
    divider: colors.grey200,
    customization,
  };

  const themeOptions: ThemeOptions = {
    direction: "ltr",
    palette: themePalette(customThemeProperties),
    mixins: {
      toolbar: {
        minHeight: "48px",
        padding: "16px",
        "@media (min-width: 600px)": {
          minHeight: "48px",
        },
      },
    },
    typography: themeTypography(customThemeProperties),
  };

  const theme = createTheme(themeOptions);
  theme.components = componentStyleOverrides(customThemeProperties);

  return theme as Theme & { customProperties: CustomThemeProperties };
};

export default theme;
