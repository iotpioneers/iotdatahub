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

declare module "@mui/material/styles" {
  interface TypographyVariants {
    customInput: React.CSSProperties;
    commonAvatar: React.CSSProperties;
    mediumAvatar: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    customInput?: React.CSSProperties;
    commonAvatar?: React.CSSProperties;
    mediumAvatar?: React.CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    customInput: true;
    commonAvatar: true;
    mediumAvatar: true;
  }
}
