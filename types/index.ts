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

export interface Member {
  country: string;
  avatar: string;
  access: string;
  createdAt: Date;
  id: string;
  name: string;
  email: string;
  updatedAt: Date;
  userId: string;
  organizationId: string;
}

export interface AddMemberProps {
  onNewMember: (newMember: Member) => void;
}
