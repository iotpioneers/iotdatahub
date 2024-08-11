import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    country: string;
    phonenumber: string;
    emailVerified: Date | null;
    image: string | null;
    role: string;
    subscriptionId: string | null;
    organizationId: string | null;
  }

  interface Session {
    user: User & {
      id: string;
      name: string;
      email: string;
      country: string;
      phonenumber: string;
      role: string;
      subscriptionId: string | null;
      organizationId: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    country: string;
    phonenumber: string;
    role: string;
    subscriptionId: string | null;
    organizationId: string | null;
  }
}
