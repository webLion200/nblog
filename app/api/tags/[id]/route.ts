import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { tagSchema } from "@/lib/validation";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 1. 验证用户身份
    const { userInfo } = await validateRequest();
    if (!userInfo?.id) {
      throw new Error("请先登录");
    }
    const userId = userInfo.id;

    // 2. 验证请求数据
    const body = await request.json();
    const validation = tagSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // 3. 验证目录归属
    const existingTag = await prisma.tag.findUnique({
      where: { id: params.id },
    });

    if (!existingTag || existingTag.authorId !== userId) {
      return NextResponse.json({ error: "标签不存在" }, { status: 404 });
    }

    // 4. 更新目录
    const updatedTag = await prisma.tag.update({
      where: { id: params.id },
      data: {
        label: validation.data.label,
        value: validation.data.value,
      },
    });

    return NextResponse.json(updatedTag);
  } catch (error) {
    // 处理唯一性冲突
    if ((error as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "标签名称已存在" }, { status: 409 });
    }
    console.error("[CATEGORY_UPDATE_ERROR]", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userInfo } = await validateRequest();
  if (!userInfo?.id) {
    throw new Error("请先登录");
  }

  try {
    await prisma.tag.deleteMany({
      where: {
        id: {
          contains: params.id,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
