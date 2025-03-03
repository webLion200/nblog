"use client";

import { signUpSchema, SignUpValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getUser, resetPassword, signUp } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { UserInfo } from "@/lib/types";

let userInfo: Partial<UserInfo> = {
  id: "",
  username: "",
  email: "",
};

export default function RegisterPage() {
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const defaultUsername = searchParams?.get("username") || "";
  const pageType = searchParams?.get("type");

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: defaultUsername,
      email: "",
      password: "",
    },
  });

  const fetchUser = useCallback(async () => {
    const res = await getUser(defaultUsername);
    if (res?.error) {
      setError(res.error);
    } else if (res.userInfo) {
      userInfo = res.userInfo as UserInfo;
      if (userInfo.email) {
        form.setValue("email", userInfo?.email);
      }
    }
  }, [defaultUsername, form]);

  useEffect(() => {
    if (pageType === "reset") {
      fetchUser();
    }
  }, [fetchUser, pageType]);

  const onSubmit = async (data: SignUpValues) => {
    setError(undefined);
    startTransition(async () => {
      if (pageType === "reset") {
        if (userInfo?.id) {
          await resetPassword(userInfo.id, data.password);
        }
      } else {
        const res = await signUp(data);
        if (res?.error) setError(res.error);
      }
    });
  };

  return (
    <div className="h-lvh flex justify-center items-center">
      <Card className="w-xl mx-auto p-4">
        <div className="text-red-400 text-center py-8">
          该系统暂不对外开放，有问题请联系管理员
        </div>
        <CardTitle className="text-center text-2xl font-bold mb-4">
          注册
        </CardTitle>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && <p className="text-center text-destructive">{error}</p>}

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>用户名</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="用户名"
                        className="border p-2 w-full"
                        disabled={pageType === "reset"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>邮箱</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="邮箱"
                        disabled={pageType === "reset"}
                        className="border p-2 w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>密码</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="密码"
                        className="border p-2 w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                // disabled={isPending}
                disabled
                type="submit"
                className="bg-blue-500 text-white p-2 w-full"
              >
                注册
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
