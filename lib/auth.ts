import Credentials from "@auth/core/providers/credentials";
import { signInSchema } from "./zod";
import NextAuth from "next-auth";
import jwt, { Secret } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "@auth/core/providers/google";

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          role: "USER",
          image: profile.picture,
        };
      },
    }),
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials.email || !credentials.password) {
          throw new Error("Missing credentials");
        }

        const { email, password } = await signInSchema.parseAsync(credentials);

        const user = await prisma.user.findUnique({
          where: { email: email },
        });
        if (!user) {
          throw new Error("User not found.");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid password.");
        }

        const token = {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };

        const accessToken = jwt.sign(token, process.env.JWT_SECRET as Secret, {
          expiresIn: "1h",
        });
        console.log(
          process.env.JWT_SECRET,
          process.env.AUTH_SECRET,
          accessToken
        );
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          accessToken,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    signOut: "/auth/signout",
    newUser: "/register",
    error: "/anasayfa",
  },

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      return session;
    },
  },
});
