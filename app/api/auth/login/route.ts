import { signJwt } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        {
          error: "邮箱和密码不能为空",
        },
        {
          status: 400,
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user || !user.password) {
      return NextResponse.json(
        {
          error: "用户不存在",
        },
        {
          status: 401,
        }
      );
    }

    const pwdValid = await bcrypt.compare(password, user.password);
    if (!pwdValid) {
      return NextResponse.json(
        {
          error: "密码错误",
        },
        {
          status: 401,
        }
      );
    }

    const token = signJwt({ userId: user.id });
    return NextResponse.json({ message: "登录成功", token }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
