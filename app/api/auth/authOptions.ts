// C:\Users\emash\IoTDataHub\app\api\auth\authOptions.ts

import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

interface Credentials {
  email: string;
  password: string;
}

const prisma = new PrismaClient();

const login = async (credentials: Credentials) => {
  if (!credentials.email || !credentials.password) {
    throw new Error("Please fill in the credentials.");
  }

  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
  });

  if (!user) {
    throw new Error(
      "The email or password you entered is incorrect. Please try again.",
    );
  }

  if (user.emailVerified === null) {
    throw new Error("Please verify your email address first");
  }

  const passwordMatch = await bcrypt.compare(
    credentials.password,
    user.password!,
  );

  if (!passwordMatch) {
    throw new Error(
      "The email or password you entered is incorrect. Please try again.",
    );
  }

  return user;
};

const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      httpOptions: {
        timeout: Number(process.env.GOOGLE_TIMEOUT!),
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name || "",
          email: profile.email!,
          emailVerified: new Date(),
          image: profile.picture || null,
          country: "",
          phonenumber: "",
          role: Role.USER,
          subscriptionId: null,
          organizationId: null,
        };
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        try {
          if (!credentials) {
            throw new Error("Please provide credentials.");
          }
          const user = await login(credentials);
          if (!user) {
            return null;
          }
          return user;
        } catch (error) {
          throw error;
        }
      },
    }),
  ],
  debug: true,
  session: {
    strategy: "jwt",
    maxAge: Number(process.env.NEXT_AUTH_TIMEOUT!),
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        return { ...token, ...session.user };
      }

      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image ?? null;
        token.country = user.country;
        token.phonenumber = user.phonenumber;
        token.emailVerified = user.emailVerified;
        token.role = user.role;
        token.subscriptionId = user.subscriptionId;
        token.organizationId = user.organizationId;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image as string | null;
        session.user.role = token.role;
        session.user.country = token.country;
        session.user.phonenumber = token.phonenumber;
        session.user.emailVerified = token.emailVerified as Date | null;
        session.user.subscriptionId = token.subscriptionId;
        session.user.organizationId = token.organizationId;
      }
      return session;
    },
  },
};

export default authOptions;
