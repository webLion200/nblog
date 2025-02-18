"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useActionState } from "react";
import login from "./actions";

export default function LoginPage() {
  const [errorMessage, formAction] = useActionState(login, undefined);

  return (
    <div className="h-lvh flex justify-center items-center">
      <Card className="w-xl pt-10">
        <CardTitle className="text-center">登录页</CardTitle>
        <CardContent className="mt-10">
          <form action={formAction} className="space-y-4">
            <Input
              type="email"
              name="email"
              placeholder="请输入邮箱"
              className="border p-2 w-full"
            />
            <Input
              type="password"
              name="password"
              placeholder="请输入密码"
              className="border p-2 w-full"
            />
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-400 cursor-pointer text-white p-2 w-full"
            >
              登录
            </Button>
          </form>
        </CardContent>
        <CardFooter>
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
        </CardFooter>
      </Card>
    </div>
  );
}
