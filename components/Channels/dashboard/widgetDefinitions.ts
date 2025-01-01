import { WidgetDefinition } from "@/types/widgets";

export const widgetDefinitions: WidgetDefinition[] = [
  {
    type: "switch",
    label: "Switch",
    icon: "toggle_on",
    defaultSize: { w: 2, h: 1 },
    category: "control",
  },
  {
    type: "slider",
    label: "Slider",
    icon: "tune",
    defaultSize: { w: 3, h: 1 },
    category: "control",
  },
  {
    type: "numberInput",
    label: "Number Input",
    icon: "numbers",
    defaultSize: { w: 2, h: 1 },
    category: "input",
  },
  {
    type: "imageButton",
    label: "Image Button",
    icon: "image",
    defaultSize: { w: 2, h: 2 },
    category: "control",
  },
  {
    type: "webPageImage",
    label: "Web Page Image",
    icon: "language",
    defaultSize: { w: 4, h: 3 },
    category: "media",
  },
  {
    type: "led",
    label: "LED",
    icon: "circle",
    defaultSize: { w: 1, h: 1 },
    category: "display",
  },
  {
    type: "label",
    label: "Label",
    icon: "label",
    defaultSize: { w: 2, h: 1 },
    category: "display",
  },
  // ... Add all other widget definitions
];
