import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "所有字段都是必填的" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json(
        {
          error: "该邮箱已经被注册",
        },
        {
          status: 400,
        }
      );
    }

    // 哈希密码
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: "注册成功",
        user,
      },
      {
        status: 201,
      }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
