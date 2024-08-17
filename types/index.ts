import { BaseMetadata } from "@liveblocks/client";
import { ThreadData } from "@liveblocks/node";

export interface ChannelProps {
  id: string;
  name: string;
  description: string;
  deviceId?: string | null;
  organizationId: string;
  access: "PUBLIC" | "PRIVATE";
  createdAt: Date;
  updatedAt: Date;
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

export type ShareChannelParams = {
  roomId: string;
  receiverEmail: string;
  userType: UserAccessType;
  updatedBy: User;
};

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
  channel: ChannelProps;
  dataPoint: DataPointProps[];
};

export type ChannelNavigationProps = {
  channelId: string;
  dataPoint: DataPointProps[];
  fields: FieldProps[];
  sampleCodes: string;
  apiKey: string;
};

export type ChannelCollaborativeRoomProps = {
  roomId: string;
  roomMetadata: RoomMetadata;
  users: User[];
  currentUserType: UserAccessType;
  channel: ChannelProps;
  dataPoint: DataPointProps[];
  fields: FieldProps[];
  apiKey: string;
  sampleCodes: string;
};

export type AddDocumentBtnProps = {
  userId: string;
  email: string;
};

export type DeleteModalProps = { channelId: string };

export type ThreadWrapperProps = { thread: ThreadData<BaseMetadata> };
