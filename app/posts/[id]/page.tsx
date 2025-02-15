import { prisma } from "@/lib/prisma";

export default async function PostDetail({
  params,
}: {
  params: { id: string };
}) {
  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) return <p>文章未找到</p>;
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="mt-4">{post.content}</p>
    </div>
  );
}
