import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    image: string | null;
    country: string;
    phonenumber: string;
    emailVerified: Date | null;
    role: string;
    subscriptionId: string | null;
    organizationId: string | null;
  }

  interface Session {
    user: User & {
      id: string;
      name: string;
      email: string;
      image: string | null;
      country: string;
      phonenumber: string;
      emailVerified: Date | null;
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
    emailVerified: Date | null;
    role: string;
    subscriptionId: string | null;
    organizationId: string | null;
  }
}
