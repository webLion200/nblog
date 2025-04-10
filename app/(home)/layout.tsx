import { MainHeader } from "@/components/main-header";
import { auth } from "@/lib/auth";
import { ReactNode } from "react";
import SessionProvider from "../../lib/SessionProvider";
import StarBackground from "@/components/star-background";

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider value={session}>
      <StarBackground className="-z-100" />
      <div className="container mx-auto">
        <MainHeader />
        <div>{children}</div>
      </div>
    </SessionProvider>
  );
}
