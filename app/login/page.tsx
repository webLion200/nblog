"use client";
import { useActionState } from "react";
import login from "./actions";

export default function LoginPage() {
  const [errorMessage, formAction] = useActionState(login, undefined);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">登录</h1>
      <form action={formAction} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="邮箱"
          className="border p-2 w-full"
        />
        <input
          type="password"
          name="password"
          placeholder="密码"
          className="border p-2 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full">
          登录
        </button>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
