// action - state management
import {
  MENU_OPEN,
  SET_MENU,
  SET_FONT_FAMILY,
  SET_BORDER_RADIUS,
  SET_NAV_TYPE,
  CustomizationActions,
} from "./actions";

export const initialState = {
  isOpen: [], // for active default menu
  defaultId: "",
  fontFamily: `'Roboto', sans-serif`,
  borderRadius: 1.5,
  opened: true,
  navType: "light" as "light" | "dark",
};

// ==============================|| CUSTOMIZATION REDUCER ||============================== //

const customizationReducer = (
  state = initialState,
  action: CustomizationActions,
) => {
  let id;
  switch (action.type) {
    case MENU_OPEN:
      id = action.id;
      return {
        ...state,
        isOpen: [id],
      };
    case SET_MENU:
      return {
        ...state,
        opened: action.opened,
      };
    case SET_FONT_FAMILY:
      return {
        ...state,
        fontFamily: action.fontFamily,
      };
    case SET_BORDER_RADIUS:
      return {
        ...state,
        borderRadius: action.borderRadius,
      };

    case SET_NAV_TYPE:
      return {
        ...state,
        navType: action.navType,
      };
    default:
      return state;
  }
};

export default customizationReducer;
