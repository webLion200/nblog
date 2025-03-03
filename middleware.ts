// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 克隆 headers 并注入路径
  const headers = new Headers(request.headers);
  headers.set("x-pathname", request.nextUrl.pathname);

  return NextResponse.next({
    request: { headers },
  });
}
