import { z } from "zod";

export const signUpSchema = z.object({
  username: z.string().min(2, { message: "至少输入两个字符" }),
  email: z
    .string()
    .min(1, { message: "请填写 Email" })
    .email({ message: "请填写正确的邮箱地址" }),
  password: z.string().min(5, "密码最少设置 5 个字符"),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, { message: "请填写用户名" })
    .min(2, "用户名最少设置 2 个字符"),
  password: z
    .string()
    .min(1, { message: "请填写密码" })
    .min(5, "密码最少设置 5 个字符"),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const postSchema = z.object({
  title: z
    .string()
    .min(1, { message: "请填写标题" })
    .max(10000, { message: "内容最多10000个字符" }),
  content: z.string().min(1, { message: "请填写内容" }),
});

export type PcostValues = z.infer<typeof postSchema>;
