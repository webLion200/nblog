import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { tagSchema } from "@/lib/validation";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const posts = await prisma.tag.findMany({
    orderBy: {
      label: "asc",
    },
  });

  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  try {
    const { userInfo } = await validateRequest();
    if (!userInfo?.id) {
      throw new Error("请先登录");
    }

    const userId = userInfo.id;

    const body = await req.json();
    const validation = tagSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const newTag = await prisma.tag.create({
      data: {
        value: validation.data.value,
        label: validation.data.label,
        authorId: userId,
      },
    });

    return NextResponse.json(newTag, { status: 201 });
  } catch (error) {
    // 4. 处理唯一性冲突错误
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "该标签值已被使用" },
          { status: 409 }
        );
      }
    }

    // 5. 其他错误处理
    console.error("[TAG_CREATE_ERROR]", error);
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
  }
}
