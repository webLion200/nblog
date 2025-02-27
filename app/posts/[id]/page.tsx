import { prisma } from "@/lib/prisma";
import Editor from "@/components/meditor";
import Tree from "@/components/tree";
import { ScrollArea } from "@radix-ui/react-scroll-area";

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

export default async function PostDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = (await params).id;
  const post = await prisma.post.findUnique({ where: { id } });

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

  if (!post) return <p>文章未找到</p>;

  // const directoryData = [
  //   {
  //     id: "1",
  //     title: "目录 1",
  //     type: "folder",
  //     children: [
  //       {
  //         id: "1-1",
  //         title: "目录 1-1",
  //         type: "folder",
  //         children: [
  //           {
  //             id: "1-1-1",
  //             title: "文章标题 1-1-1文章标题 1-1-1文章标题 1-1-1",
  //             type: "file",
  //           },
  //         ],
  //       },
  //     ],
  //   },
  //   {
  //     id: "2",
  //     title: "目录 2",
  //     type: "folder",
  //     children: [
  //       {
  //         id: "2-1",
  //         title: "目录 2-1",
  //         type: "folder",
  //       },
  //     ],
  //   },
  //   {
  //     id: "3",
  //     title: "目录 1",
  //     type: "folder",
  //     children: [
  //       {
  //         id: "1-1",
  //         title: "目录 1-1",
  //         type: "folder",
  //         children: [
  //           {
  //             id: "1-1-1",
  //             title: "文章标题 1-1-1",
  //             type: "file",
  //           },
  //         ],
  //       },
  //       {
  //         id: "1-2",
  //         title: "目录 1-1",
  //         type: "folder",
  //         children: [
  //           {
  //             id: "1-1-1",
  //             title: "文章标题 1-1-1",
  //             type: "file",
  //           },
  //         ],
  //       },
  //       {
  //         id: "1-3",
  //         title: "目录 1-1",
  //         type: "folder",
  //         children: [
  //           {
  //             id: "1-1-1",
  //             title: "文章标题 1-1-1",
  //             type: "file",
  //           },
  //         ],
  //       },
  //     ],
  //   },
  //   {
  //     id: "4",
  //     title: "目录 1",
  //     type: "folder",
  //     children: [
  //       {
  //         id: "1-1",
  //         title: "目录 1-1",
  //         type: "folder",
  //         children: [
  //           {
  //             id: "1-1-1",
  //             title: "文章标题 1-1-1",
  //             type: "file",
  //           },
  //         ],
  //       },
  //       {
  //         id: "1-2",
  //         title: "目录 1-1",
  //         type: "folder",
  //         children: [
  //           {
  //             id: "1-1-1",
  //             title: "文章标题 1-1-1",
  //             type: "file",
  //           },
  //         ],
  //       },
  //       {
  //         id: "1-3",
  //         title: "目录 1-1",
  //         type: "folder",
  //         children: [
  //           {
  //             id: "1-1-1",
  //             title: "文章标题 1-1-1",
  //             type: "file",
  //           },
  //         ],
  //       },
  //     ],
  //   },
  //   {
  //     id: "5",
  //     title: "目录 1",
  //     type: "folder",
  //     children: [
  //       {
  //         id: "1-1",
  //         title: "目录 1-1",
  //         type: "folder",
  //         children: [
  //           {
  //             id: "1-1-1",
  //             title: "文章标题 1-1-1",
  //             type: "file",
  //           },
  //         ],
  //       },
  //       {
  //         id: "1-2",
  //         title: "目录 1-1",
  //         type: "folder",
  //         children: [
  //           {
  //             id: "1-1-1",
  //             title: "文章标题 1-1-1",
  //             type: "file",
  //           },
  //         ],
  //       },
  //       {
  //         id: "1-3",
  //         title: "目录 1-1",
  //         type: "folder",
  //         children: [
  //           {
  //             id: "1-1-1",
  //             title: "文章标题 1-1-1",
  //             type: "file",
  //           },
  //         ],
  //       },
  //     ],
  //   },
  // ];

  return (
    <ScrollArea className="container flex mx-auto min-h-screen py-20 gap-10">
      <div
        className={`sticky top-20 w-50 max-h-[calc(100vh-20rem)]  bg-white rounded-md p-4 overflow-y-auto `}
      >
        <Tree data={directoryData} />
      </div>
      <div className="flex-1">
        <div className=" text-3xl font-bold text-white">{post.title}</div>
        <div className="pt-8">
          <Editor defaultValue={post.content} editable={false} />
        </div>
      </div>
    </ScrollArea>
  );
}
