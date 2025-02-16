"use server";

import { prisma } from "@/lib/prisma";
import { signUpSchema, SignUpValues } from "@/lib/validation";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function signUp(data: SignUpValues) {
  const result = signUpSchema.safeParse(data);
  if (result.success) {
    const { name, email, password } = result.data;

    if (!name || !email || !password) {
      return {
        success: false,
        message: "都是必填项",
      };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return {
        success: false,
        message: "该邮箱已被注册",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
    } catch (error) {
      console.error(error);
      return {
        message: "Database Error: Failed to Create Invoice.",
      };
    }
    redirect("/login");
  }
}
