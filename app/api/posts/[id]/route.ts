import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
  });
  if (!post) {
    return NextResponse.json(
      {
        error: "文章未找到",
      },
      {
        status: 404,
      }
    );
  }
  return NextResponse.json(post);
}

// 更新文章
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { title, content } = await req.json();
  const updatedPost = await prisma.post.update({
    where: { id: params.id },
    data: { title, content },
  });
  return NextResponse.json(updatedPost);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await prisma.post.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "文章已删除" }, { status: 204 });
}
