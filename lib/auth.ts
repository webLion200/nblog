import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { loginSchema } from "./validation";
import { UserInfo } from "./types";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials);

        if (parsedCredentials.success) {
          const { username, password } = parsedCredentials.data;
          const user = await prisma.user.findUnique({
            where: { username },
          });

          if (!user || !user.password) return null;

          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) return null;
          return user;
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt", // ✅ 确保使用 JWT
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        const customUser = user as UserInfo;
        // User is available during sign-in
        token.username = customUser.username;
        token.id = user.id;
      }
      console.log("jwt---", token);

      return token;
    },

    session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.username = token.username;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
  },
});

export const validateRequest = async () => {
  const session = await auth();
  if (!session || !session?.user) {
    return {
      userInfo: {},
      status: 401,
    };
  }

  return {
    userInfo: {
      id: session.user.id,
    },
    status: 200,
  };
};
