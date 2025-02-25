// app/api/categories/route.ts
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validation";
import { NextResponse } from "next/server";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(categories);
}

/**
 * 新建目录
 * @param request
 */
export async function POST(request: Request) {
  const { userInfo } = await validateRequest();
  if (!userInfo?.id) {
    throw new Error("请先登录");
  }

  const userId = userInfo.id;

  try {
    const body = await request.json();
    const validation = categorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten() },
        { status: 400 }
      );
    }

    const newCategory = await prisma.category.create({
      data: { name: validation.data.name, authorId: userId },
    });
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    if ((error as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "目录名称已存在" }, { status: 409 });
    }
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
