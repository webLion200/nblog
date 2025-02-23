"use server";

import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { postDataInclude } from "@/lib/types";
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
    const { content, title } = result.data;
    const published: boolean = submitType === "publish";
    // 创建博客并返回关联的用户信息
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        authorId: userInfo.id,
        published, // 默认未发布
        createTime: new Date(), // 记录创建时间
        updateTime: new Date(), // 记录更新时间
      },
      include: postDataInclude, // 直接返回用户信息
    });

    redirect("/");

    return newPost;
  } else {
    console.log("error", result.error);
  }
};
