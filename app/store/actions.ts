export const SET_MENU = "@customization/SET_MENU";
export const MENU_TOGGLE = "@customization/MENU_TOGGLE";
export const MENU_OPEN = "@customization/MENU_OPEN";
export const SET_FONT_FAMILY = "@customization/SET_FONT_FAMILY";
export const SET_BORDER_RADIUS = "@customization/SET_BORDER_RADIUS";

interface MenuOpenAction {
  type: typeof MENU_OPEN;
  id: string;
}

interface SetMenuAction {
  type: typeof SET_MENU;
  opened: boolean;
}

interface SetFontFamilyAction {
  type: typeof SET_FONT_FAMILY;
  fontFamily: string;
}

interface SetBorderRadiusAction {
  type: typeof SET_BORDER_RADIUS;
  borderRadius: number;
}

export type CustomizationActions =
  | MenuOpenAction
  | SetMenuAction
  | SetFontFamilyAction
  | SetBorderRadiusAction;
