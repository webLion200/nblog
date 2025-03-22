import { auth } from "@/lib/auth";
import { ReactNode } from "react";
import SessionProvider from "../../lib/SessionProvider";
import dynamic from "next/dynamic";

// 动态导入 StarBackground 组件
const StarBackground = dynamic(() => import("@/components/star-background"));

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider value={session}>
      <StarBackground />
      <div>{children}</div>
    </SessionProvider>
  );
}
