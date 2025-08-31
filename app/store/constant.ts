// theme constant
export const gridSpacing = 3;
export const drawerWidth = 260;
export const appDrawerWidth = 320;

// Default size based on widget type
export const getDefaultSize = (type?: string) => {
  switch (type) {
    case "switch":
    case "led":
      return { w: 3, h: 2 };
    case "label":
      return { w: 4, h: 3 };
    case "heatmapChart":
    case "textInput":
    case "segmentedSwitch":
      return { w: 6, h: 3 };
    case "gauge":
    case "radialGauge":
    case "chart":
    case "customChart":
    case "map":
      return { w: 9, h: 6 };
    default:
      return { w: 6, h: 4 };
  }
};
