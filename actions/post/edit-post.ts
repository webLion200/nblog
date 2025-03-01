"use server";

import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { extractSummary } from "@/lib/utils";
import { PostSchemaValues, postSchema } from "@/lib/validation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export type BtnType = "publish" | "saveDraft";

const tagCache = new Map<string, string>(); // 简单内存缓存

const getOrCreateTagId = async (value: string, authorId: string) => {
  const cacheKey = `${value}-${authorId}`;
  if (tagCache.has(cacheKey)) return tagCache.get(cacheKey)!;

  const tag = await prisma.tag.upsert({
    where: { value_authorId: { value, authorId } },
    update: {},
    create: { value, label: value, authorId },
  });

  tagCache.set(cacheKey, tag.id);
  return tag.id;
};

export const editBlog = async (
  id: string,
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

    const categoryId = result.data.categoryId || null;

    const existingPost = await prisma.post.findUnique({
      where: { id },
      select: { title: true, content: true, categoryId: true, published: true },
    });
    const updateData: Record<string, any> = {};
    if (published !== updateData.published) updateData.published = published;
    if (title !== existingPost?.title) updateData.title = title;
    if (content !== existingPost?.content) {
      updateData.content = content;
      updateData.summary = await extractSummary(content); // 仅内容变化时更新摘要
    }
    if (categoryId !== existingPost?.categoryId)
      updateData.categoryId = categoryId;

    if (Object.keys(updateData).length > 0) {
      await prisma.post.update({
        where: { id },
        data: updateData,
      });
    }

    const existingTags = await prisma.postTag.findMany({
      where: { postId: id },
      select: { tag: { select: { value: true } } },
    });
    const existingTagValues = existingTags.map((t) => t.tag.value);
    const newTags = tags?.filter((t) => !existingTagValues.includes(t)) || [];
    const removedTags =
      existingTagValues.filter((t) => !tags?.includes(t)) || [];

    await prisma.$transaction([
      ...(removedTags.length > 0
        ? [
            prisma.postTag.deleteMany({
              where: {
                postId: id,
                tag: {
                  value: { in: removedTags },
                },
              },
            }),
          ]
        : []),

      prisma.post.update({
        where: { id },
        data: {
          tags: {
            connectOrCreate: await Promise.all(
              newTags.map(async (tagVal) => ({
                where: {
                  postId_tagId: {
                    postId: id,
                    tagId: await getOrCreateTagId(tagVal, userId), // 封装获取逻辑
                  },
                },
                create: {
                  tag: {
                    connectOrCreate: {
                      where: {
                        value_authorId: { value: tagVal, authorId: userId },
                      },
                      create: {
                        value: tagVal,
                        label: tagVal,
                        authorId: userId,
                      },
                    },
                  },
                },
              }))
            ),
          },
        },
      }),
    ]);

    redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;

    return { error: "数据库操作失败" };
  }
};
