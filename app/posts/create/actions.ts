"use server";

import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PostValues, postSchema } from "@/lib/validation";
import { redirect } from "next/navigation";

export type BtnType = "publish" | "saveDraft";

export const createBlog = async (data: PostValues, submitType: BtnType) => {
  const { userInfo } = await validateRequest();
  if (!userInfo?.id) {
    throw new Error("请登录");
  }

  const result = postSchema.safeParse(data);
  if (result.success) {
    const { content, title, tags, categoryId } = result.data;
    const published: boolean = submitType === "publish";
    // 创建博客并返回关联的用户信息
    const userId = userInfo.id;

    await prisma.post.create({
      data: {
        title,
        content,
        authorId: userId,
        published, // 默认未发布
        categoryId,
        postTags: {
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
  } else {
    console.log("error", result.error);
  }
};
