import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
  });

  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session?.user) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "标题和内容不能为空" },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        published: true,
        authorId: session.user.id as string, // 关联当前登录用户
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
