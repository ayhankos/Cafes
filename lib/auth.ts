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
      allowDangerousEmailAccountLinking: true,
      async profile(profile) {
        const existingUser = await prisma.user.findUnique({
          where: { email: profile.email },
          include: {
            accounts: true,
          },
        });

        if (existingUser) {
          // Kullanıcı zaten varsa, hesabı güncelle
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              name: profile.name,
              email: profile.email,
            },
          });

          return {
            id: existingUser.id,
            name: profile.name,
            email: profile.email,
            role: existingUser.role || "USER",
          };
        }

        // Yeni kullanıcı oluştur
        const newUser = await prisma.user.create({
          data: {
            email: profile.email,
            name: profile.name,
            role: "USER",
          },
        });

        return {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: "USER",
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
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const { email, password } = await signInSchema.parseAsync(credentials);

        const user = await prisma.user.findUnique({
          where: { email: email },
          include: {
            accounts: true,
          },
        });

        if (!user) {
          throw new Error("User not found.");
        }

        // Eğer kullanıcının password'ü yoksa (Google ile giriş yapmışsa)
        if (!user.password) {
          throw new Error("Please sign in with Google for this account.");
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
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        return true; // Google girişlerine her zaman izin ver
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      return session;
    },
  },
});
