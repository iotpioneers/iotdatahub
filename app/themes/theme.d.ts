import {
  Theme as MuiTheme,
  ThemeOptions as MuiThemeOptions,
} from "@mui/material/styles";
import { CustomThemeProperties } from "./index";

declare module "@mui/material/styles" {
  interface Theme extends MuiTheme {
    customProperties: CustomThemeProperties;
  }

  interface ThemeOptions extends MuiThemeOptions {
    customProperties?: Partial<CustomThemeProperties>;
  }
}
