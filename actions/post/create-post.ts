"use server";

import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { extractSummary } from "@/lib/utils";
import { PostSchemaValues, postSchema } from "@/lib/validation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export type BtnType = "publish" | "saveDraft";

export const createBlog = async (
  data: PostSchemaValues,
  submitType: BtnType
) => {
  try {
    const { userInfo } = await validateRequest();
    if (!userInfo?.id) {
      throw new Error("请登录");
    }

    const result = postSchema.safeParse(data);

    if (!result.success) {
      return { error: result.error.format() };
    }

    const { content, title, tags } = result.data;
    const published: boolean = submitType === "publish";
    // 创建博客并返回关联的用户信息
    const userId = userInfo.id;
    const summary: string = await extractSummary(content);

    let categoryId = result.data.categoryId || null;
    if (categoryId === "-1") {
      categoryId = null;
    }

    await prisma.post.create({
      data: {
        title,
        summary,
        content,
        authorId: userId,
        published, // 默认未发布
        categoryId,
        tags: {
          create: tags?.map((tagVal) => {
            return {
              tag: {
                connect: {
                  value_authorId: { value: tagVal, authorId: userId },
                },
              },
            };
          }),
        },
      },
    });

    redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;

    return { error: "数据库操作失败" };
  }
};
