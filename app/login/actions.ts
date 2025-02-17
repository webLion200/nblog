"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export type State = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};

export default async function login(
  preState: string | undefined,
  formData: FormData
) {
  try {
    const result = await signIn("credentials", {
      redirect: false, // 禁止自动重定向，手动控制跳转
      ...Object.fromEntries(formData),
    });

    if (result?.error) {
      throw new Error(result.error); // 如果出现错误，抛出错误
    }

    // 登录成功后，手动进行重定向
    redirect("/"); // 重定向到首页
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "账号密码不正确";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
