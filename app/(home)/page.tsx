import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { postDataInclude } from "@/lib/types";

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    include: postDataInclude,
    orderBy: {
      updateTime: "desc",
    },
  });
  return (
    <div className="mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">博客首页</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="mb-2">
            <Link
              href={`/posts/${post.id}`}
              className="text-blue-500 hover:underline"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
