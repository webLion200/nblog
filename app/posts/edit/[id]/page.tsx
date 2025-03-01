import { prisma } from "@/lib/prisma";
import PostForm from "@/components/posts/post-form";

export default async function EditPost({ params }: { params: { id: string } }) {
  const id = (await params).id;
  const res = await prisma.post.findUnique({
    where: { id },
    include: {
      tags: {
        include: {
          tag: {
            select: {
              id: true,
              label: true,
              value: true,
            },
          },
        },
      },
    },
  });
  const post = {
    ...res,
    tags: res?.tags.map((t) => t.tag),
  };
  return (
    <div className="container mx-auto bg-white">
      <div className="relative flex flex-col h-screen">
        <h1 className="sticky left-0 right-0 top-0 px-[10px] py-10 text-2xl font-bold  bg-white z-10">
          编辑博客
        </h1>
        {post ? (
          <PostForm defaultValues={post} type="edit" />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
