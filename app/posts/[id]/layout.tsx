import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ReactNode, Suspense } from "react";
import DetailLoading from "./loading";
import Tools from "./tools";
import React from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { getCachedCategories } from "@/lib/data";
import { buildPostTree } from "@/lib/utils";

const Tree = dynamic(() => import("@/components/tree"), {
  loading: () => <Skeleton className="h-[300px] w-full" />,
});

export async function generateStaticParams() {
  const categories = await getCachedCategories();
  return categories.flatMap((c) => c.posts.map((p) => ({ id: p.id })));
}

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  const categories = await getCachedCategories();
  const treeData = buildPostTree(categories);

  return (
    <ScrollArea className="container flex mx-auto min-h-screen py-20 gap-10">
      <aside className="sticky top-20 w-60 h-[80vh] overflow-hidden p-4 bg-background shadow-lg rounded-lg">
        <Suspense fallback={<div aria-busy="true">加载导航中...</div>}>
          <Tree data={treeData} />
        </Suspense>
      </aside>
      <main className="flex-1">
        <Suspense fallback={<DetailLoading />}>{children}</Suspense>
      </main>

      <div className="sticky top-10/12 ml-auto w-20 h-fit">
        <Tools />
      </div>
    </ScrollArea>
  );
}
