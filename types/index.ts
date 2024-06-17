import { MouseEventHandler } from "react";

export interface CustomButtonProps {
  title: string;
  containerStyles?: string;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
  btnType?: "button" | "submit";
  icon?: any;
}

export interface SearchManufacturerProps {
  manufacturer: string;
  setManufacturer: (manufacturer: string) => void;
}

export interface CreateProjectProps {
  createProject: boolean;
  setCreateProject: (createProject: boolean) => void;
}
export interface ChannelProps {
  id: string;
  name: string;
  description: string;
  deviceId?: string | null;
  access: "PUBLIC" | "PRIVATE";
  createdAt: string;
  updatedAt: string;
  userId: string;
}
export interface DataPointProps {
  id: string;
  timestamp: string;
  value: number;
  fieldId: string;
  channelId: string;
  createdAt: string;
  updatedAt: string;
}
export interface FieldProps {
  id: string;
  name: string;
  description: string;
  channelId: string;
  createdAt: string;
  updatedAt: string;
}
