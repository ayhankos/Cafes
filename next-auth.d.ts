import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string; // Add role here
    } & DefaultSession["user"];
  }

  interface User {
    role?: string; // Add role here
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string; // Add role here
  }
}
