"use client";

import { createContext, useContext } from "react";
import { ISession } from "./types";

const SessionContext = createContext<ISession | null>(null);

export default function SessionProvider({
  children,
  value,
}: React.PropsWithChildren<{ value: ISession | null }>) {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  // if (!context) {
  //   throw new Error("useSession must be used within a SessionProvider");
  // }

  return context;
}
