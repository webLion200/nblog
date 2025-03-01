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
    .max(100, { message: "标题最多100个字符" }),
  content: z
    .string()
    .min(1, { message: "请填写内容" })
    .max(20000, { message: "内容最多20000个字符" }),
  tags: z.array(z.string().min(1)).max(5).optional(), // 限制最多5个标签
  categoryId: z.string().optional(),
});

export type PostSchemaValues = z.infer<typeof postSchema>;

export const tagSchema = z.object({
  value: z
    .string()
    .min(1, "标签值不能为空")
    .max(50, "标签值最多50个字符")
    .regex(/^[a-zA-Z0-9-_.]+$/, "只允许字母、数字、中划线和下划线"),
  label: z.string().min(1, "显示名称不能为空").max(50, "显示名称最多50个字符"),
});

export type TagValues = z.infer<typeof tagSchema>;

export const categorySchema = z.object({
  name: z.string().min(1).max(50),
});

export type CategoryValues = z.infer<typeof categorySchema>;
