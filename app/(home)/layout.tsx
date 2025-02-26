import { MainHeader } from "@/components/main-header";
import { auth } from "@/lib/auth";
import { ReactNode } from "react";
import SessionProvider from "../../lib/SessionProvider";

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider value={session}>
      <div className="container mx-auto">
        <MainHeader />
        <div>{children}</div>
      </div>
    </SessionProvider>
  );
}
