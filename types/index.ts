import { BaseMetadata } from "@liveblocks/client";
import { ThreadData } from "@liveblocks/node";

export interface ApiKey {
  id: string;
  apiKey: string;
  userId: string;
  channelId: string;
  organizationId: string;
}

export interface SampleCodes {
  id: string;
  codes: string;
  apiKeyId: string;
  organizationId: string;
}

export interface Device {
  id: string;
  name: string;
  description: string;
  channelId: string | null;
  organizationId: string;
  status: "ONLINE" | "OFFLINE" | "DISCONNECTED";
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  deviceId?: string | null;
  organizationId: string;
  access: "PUBLIC" | "PRIVATE";
  ownerEmail: string;
  ownerImage: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface DataPoint {
  id: string;
  timestamp: string;
  value: number;
  fieldId: string;
  channelId: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}
export interface Field {
  id: string;
  name: string;
  description: string;
  channelId: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  areaOfInterest: string;
  createdAt: Date;
  id: string;
  name: string;
  type: string;
  updatedAt: Date;
  userId: string;
}

export interface Member {
  country: string;
  avatar?: string;
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

/* eslint-disable no-unused-vars */

export type ChannelAccessType =
  | ["room:write"]
  | ["room:read", "room:presence:write"];

export type RoomAccesses = Record<string, ChannelAccessType>;

export type UserAccessType = "viewer" | "editor";

export type RoomMetadata = {
  creatorId: string;
  email: string;
  title: string;
};

export type CreateChannelRoomParams = {
  roomId: string;
  email: string;
  userId: string;
  title: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  color: string;
  userType?: UserAccessType;
};

export interface ShareChannelParams {
  roomId: string;
  collaborators: Array<{
    email: string;
    userType: UserAccessType;
  }>;
  notifyPeople: boolean;
  message?: string;
  updatedBy: User;
}

export type UserTypeSelectorParams = {
  userType: string;
  setUserType: React.Dispatch<React.SetStateAction<UserAccessType>>;
  onClickHandler?: (value: string) => void;
};

export type ShareChannelRoomAccessDialogProps = {
  roomId: string;
  collaborators: User[];
  creator: string;
  currentUserType: UserAccessType;
};

export type HeaderProps = {
  children: React.ReactNode;
  className?: string;
};

export type CollaboratorProps = {
  roomId: string;
  receiverEmail: string;
  creator: string;
  collaborator: User;
  user: User;
};

export type ChannelHeadingProps = {
  roomId: string;
  roomMetadata: RoomMetadata;
  users: User[];
  currentUserType: UserAccessType;
  channel: Channel;
  dataPoint: DataPoint[];
};

export type ChannelNavigationProps = {
  channel: Channel;
  dataPoint: DataPoint[];
  fields: Field[];
  sampleCodes: SampleCodes;
  apiKey: ApiKey;
};

export type ChannelCollaborativeRoomProps = {
  roomId: string;
  roomMetadata: RoomMetadata;
  users: User[];
  currentUserType: UserAccessType;
  channel: Channel;
  dataPoint: DataPoint[];
  fields: Field[];
  apiKey: ApiKey;
  sampleCodes: SampleCodes;
};

export type AddDocumentBtnProps = {
  userId: string;
  email: string;
};

export type DeleteModalProps = { channelId: string };

export type ThreadWrapperProps = { thread: ThreadData<BaseMetadata> };
