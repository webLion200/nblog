import { prisma } from "@/lib/prisma";
import { postDataInclude } from "@/lib/types";
import PostCard from "@/components/post-card";

export default async function HomePage() {
  const result = await prisma.post.findMany({
    where: {
      published: true,
    },
    include: postDataInclude,
    orderBy: {
      updateTime: "desc",
    },
  });

  const posts = result.map((post) => ({
    ...post,
    postTags: post.postTags.map((postTag) => postTag.tag),
  }));

  return (
    <div className="mx-auto p-6 border-1 border-gray-50 rounded-b-2xl bg-white/90 backdrop-blur-sm">
      <div>
        {posts.map((post) => (
          <PostCard key={post.id} data={post} />
        ))}
      </div>
    </div>
  );
}
