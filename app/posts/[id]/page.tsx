import { prisma } from "@/lib/prisma";
import Editor from "@/components/meditor";

export default async function PostDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = (await params).id;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return <p>文章未找到</p>;
  return (
    <div className="max-w-3xl mx-auto p-4 min-h-screen backdrop-blur-sm">
      <div className="text-3xl font-bold text-white">{post.title}</div>
      <div className="pt-8">
        <Editor defaultValue={post.content} editable={false} />
      </div>
    </div>
  );
}
