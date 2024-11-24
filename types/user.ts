export interface CollaborationUser {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  color: string;

  [key: string]: unknown;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  image: string;
  country: string;
  phonenumber: string;
  emailVerified: Date | null;
  role: string;
  subscriptionId?: string;
  organizationId?: string;
}

export interface User {
  id: string;
  name?: string;
  avatar?: string;
  email?: string;

  [key: string]: unknown;
}
