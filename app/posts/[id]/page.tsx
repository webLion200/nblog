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
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">{post.title}</h1>
      <div className="mt-4 border-t pt-8">
        {/* 添加max-w-3xl限制内容宽度 */}
        <div className="mx-auto max-w-3xl">
          {/* <MarkdownRenderer content={post.content} /> */}
          <Editor defaultValue={post.content} editable={false} />
        </div>
      </div>
    </div>
  );
}
