import { PinType } from "@/types/pin-config";

export const generatePinOptions = (pinType: PinType): string[] => {
  if (pinType === "VIRTUAL") {
    return Array.from({ length: 20 }, (_, i) => `V${i}`);
  } else if (pinType === "DIGITAL") {
    return Array.from({ length: 20 }, (_, i) => `D${i}`);
  }
  return Array.from({ length: 8 }, (_, i) => `A${i}`);
};

export const colorOptions = {
  Theme: [
    "#10B981",
    "#EF4444",
    "#F97316",
    "#F59E0B",
    "#FACC15",
    "#000000",
    "#FFFFFF",
  ],
  Complimentary: [
    "#84CC16",
    "#3B82F6",
    "#06B6D4",
    "#22C55E",
    "#14B8A6",
    "#0EA5E9",
  ],
  Neutrals: ["#1D4ED8", "#18181B", "#7C3AED", "#DB2777", "#A3E635"],
};
