export interface EmployeeMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  access: "VIEWER" | "COMMENTER" | "EDITOR";
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

// You can also create a type for creating a new member
export type CreateMemberInput = Omit<
  EmployeeMember,
  "id" | "createdAt" | "updatedAt"
>;
