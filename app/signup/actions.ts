"use server";

import { prisma } from "@/lib/prisma";
import { signUpSchema, SignUpValues } from "@/lib/validation";
import bcrypt from "bcryptjs";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export async function signUp(data: SignUpValues) {
  try {
    const result = signUpSchema.safeParse(data);
    if (result.success) {
      const { username, email, password } = result.data;

      const existUsername = await prisma.user.findUnique({
        where: { username },
      });

      if (existUsername) {
        return {
          error: "该用户名已存在",
        };
      }

      const existEmail = await prisma.user.findUnique({
        where: { email },
      });
      if (existEmail) {
        return {
          error: "该邮箱已被注册",
        };
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });

      return redirect("/login");
    }
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return {
      error: "注册失败，请联系管理员.",
    };
  }
}

export async function getUser(name: string) {
  try {
    const userInfo = await prisma.user.findUnique({
      where: {
        username: name,
      },
    });

    if (!userInfo || !userInfo.id) {
      return {
        userInfo: {},
        error: "username not exist",
      };
    }
    return {
      userInfo: {
        username: userInfo?.username,
        email: userInfo?.email,
        id: userInfo?.id,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      userInfo: {},
      error: "Something went wrong. Please try again.",
    };
  }
}

export async function resetPassword(id: string, password: string) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        password: hashedPassword,
      },
    });

    redirect("/login");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return {
      error: "Something went wrong. Please try again.",
    };
  }
}
