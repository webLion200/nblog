"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import LoginButton from "./login-button";
import { useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
};

export function MainHeader() {
  const searchParams = useSearchParams();
  const currentCate = searchParams.get("cate") || "all";
  const [categories, setCategories] = useState<Category[]>([]);

  const getCates = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories([
      {
        id: "all",
        name: "全部",
      },
      ...data,
    ]);
  };

  useEffect(() => {
    getCates();
  }, []);

  return (
    <div className="border-y-1 sticky top-0 z-50 border-black/5 bg-gray-50/60 shadow-sm shadow-gray-300 backdrop-blur-lg flex items-center justify-around ">
      <nav className="mx-auto max-w-5xl items-center justify-around px-2 py-4 flex">
        <div className="min-w-2xl flex gap-x-6">
          {categories?.map((cate) => (
            <Link
              key={cate.id}
              href={`/?cate=${cate.id}`}
              className={cn(
                "relative inline-flex items-center rounded-full px-4 py-1.5 text-base font-semibold tracking-tight text-gray-500 antialiased ring-1 ring-transparent transition duration-200 [word-spacing:-5px] active:scale-[96%] active:ring-black/20",
                {
                  "bg-transparent ring-transparent hover:bg-gradient-to-tr hover:from-gray-200 hover:via-gray-100 hover:to-gray-50 hover:shadow-md hover:shadow-black/5 hover:ring-1 hover:ring-black/10":
                    cate.id !== currentCate,
                },
                {
                  "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-50 px-4 text-gray-600 shadow-md shadow-black/5 ring-1 ring-black/10":
                    cate.id == currentCate,
                }
              )}
            >
              <div className="max-w-50 truncate">{cate.name}</div>
            </Link>
          ))}
        </div>
        <div className="justify-end cursor-pointer">
          <LoginButton />
        </div>
      </nav>
    </div>
  );
}
