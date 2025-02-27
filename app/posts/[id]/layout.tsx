import Tree from "@/components/tree";
import { prisma } from "@/lib/prisma";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ReactNode, Suspense } from "react";
import DetailLoading from "./loading";

interface IPost {
  id: string;
  title: string;
}

interface ICategory {
  id: string;
  name: string;
  posts: IPost[];
}

interface TreeNode {
  id: string;
  title: string;
  type: string;
  children?: TreeNode[];
}

function buildCategoryTree(categories: ICategory[]): TreeNode[] {
  return categories.map((category) => ({
    id: category.id,
    title: category.name,
    type: "folder",
    children: [
      ...category.posts.map((post) => ({
        id: post.id,
        title: post.title,
        type: "file",
      })),
    ],
  }));
}

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cates = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      posts: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
  const directoryData = buildCategoryTree(cates);

  return (
    <ScrollArea className="container flex mx-auto min-h-screen py-20 gap-10">
      <div
        className={`sticky top-20 w-50 max-h-[calc(100vh-20rem)]  bg-white rounded-md p-4 overflow-y-auto `}
      >
        <Tree data={directoryData} />
      </div>
      <Suspense fallback={<DetailLoading />}>{children}</Suspense>
    </ScrollArea>
  );
}
