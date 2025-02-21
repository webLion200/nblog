import { MainHeader } from "@/components/main-header";
import { auth } from "@/lib/auth";
import { ReactNode } from "react";
import SessionProvider from "../../lib/SessionProvider";
// import { ISession } from "@/lib/types";

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  console.log("session----", session);

  return (
    <SessionProvider value={session}>
      <div className="container mx-auto">
        <MainHeader />
        <div>{children}</div>
      </div>
    </SessionProvider>
  );
}
