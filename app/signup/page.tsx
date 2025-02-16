"use client";

import { signUpSchema, SignUpValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signUp } from "./actions";
export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    // setError,
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpValues) => {
    const res = await signUp(data);
    if (!res?.success) {
      alert(res?.message);
      return;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">注册</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("name")}
          type="text"
          placeholder="用户名"
          className="border p-2 w-full"
        />
        {errors.name && (
          <p className="text-red-500">{`${errors.name.message}`}</p>
        )}
        <input
          {...register("email")}
          type="email"
          placeholder="邮箱"
          className="border p-2 w-full"
        />
        {errors.email && (
          <p className="text-red-500">{`${errors.email.message}`}</p>
        )}
        <input
          {...register("password")}
          type="password"
          placeholder="密码"
          className="border p-2 w-full"
        />
        {errors.password && (
          <p className="text-red-500">{`${errors.password.message}`}</p>
        )}
        <button
          disabled={isSubmitting}
          type="submit"
          className="bg-blue-500 text-white p-2 w-full"
        >
          注册
        </button>
      </form>
    </div>
  );
}
