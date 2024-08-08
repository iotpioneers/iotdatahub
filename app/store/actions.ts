export const SET_MENU = "@customization/SET_MENU";
export const MENU_TOGGLE = "@customization/MENU_TOGGLE";
export const MENU_OPEN = "@customization/MENU_OPEN";
export const SET_FONT_FAMILY = "@customization/SET_FONT_FAMILY";
export const SET_BORDER_RADIUS = "@customization/SET_BORDER_RADIUS";
export const SET_NAV_TYPE = "@customization/SET_NAV_TYPE";

export interface MenuOpenAction {
  type: typeof MENU_OPEN;
  id: string;
}

export interface SetMenuAction {
  type: typeof SET_MENU;
  opened: boolean;
}

export interface SetFontFamilyAction {
  type: typeof SET_FONT_FAMILY;
  fontFamily: string;
}

export interface SetBorderRadiusAction {
  type: typeof SET_BORDER_RADIUS;
  borderRadius: number;
}

export interface SetNavTypeAction {
  type: typeof SET_NAV_TYPE;
  navType: "light" | "dark";
}

export type CustomizationActions =
  | MenuOpenAction
  | SetMenuAction
  | SetFontFamilyAction
  | SetBorderRadiusAction
  | SetNavTypeAction;

export const setNavType = (navType: "light" | "dark"): SetNavTypeAction => ({
  type: SET_NAV_TYPE,
  navType,
});
