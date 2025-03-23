// lib/data.ts
"use cache";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { prisma } from "./prisma";

export async function getCachedCategories() {
  try {
    // 应用博客缓存策略
    cacheLife("blog");
    cacheTag("categories");

    const data = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        posts: {
          select: { id: true, title: true, createTime: true },
          orderBy: { createTime: "desc" },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return data;
  } catch (error) {
    console.error("[CACHE] 分类数据获取失败:", error);
    return [];
  }
}

export async function getCachedPost(id: string) {
  if (!id || typeof id !== "string") {
    console.error("[CACHE] 无效的文章ID:", id);
    return null;
  }

  try {
    // 应用博客缓存策略
    cacheLife("blog");

    const start = Date.now();
    const post = await prisma.post.findUnique({
      where: { id },
      include: { category: { select: { name: true } } },
    });

    // 动态标签声明
    cacheTag(`post-${id}`);

    console.log(`[CACHE] 文章 ${id} 查询耗时 ${Date.now() - start}ms`);
    return post;
  } catch (error) {
    console.error(`[CACHE] 文章 ${id} 获取失败:`, error);
    return null;
  }
}
