import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
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
    throw new Error("User not found");
  }

  if (user.emailVerified == null) {
    throw new Error("Email not verified");
  }

  const passwordMatch = await bcrypt.compare(
    credentials.password,
    user.password!
  );

  if (!passwordMatch) {
    throw new Error("Incorrect password");
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
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
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
        session.user.subscriptionId = token.subscriptionId;
        session.user.organizationId = token.organizationId;
      }
      return session;
    },
  },
};

export default authOptions;
