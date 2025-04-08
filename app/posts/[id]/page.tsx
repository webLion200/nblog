import dynamic from "next/dynamic";
import { getCachedPost } from "@/lib/data";
import DetailLoading from "./loading";
import type { Metadata } from "next";

const Editor = dynamic(() => import("@/components/meditor"), {
  ssr: true,
  loading: () => <DetailLoading />,
});

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const id = (await params).id;
  const post = await getCachedPost(id);

  if (!post) return {};

  return {
    title: `${post.title}`,
    description: post.summary,
    // alternates: {
    //   canonical: `https://example.com/posts/${params.id}`,
    // },
    openGraph: {
      type: "article",
      publishedTime: post.createTime.toString(),
      authors: ["web blog"],
      // images: post.coverImage
      //   ? [
      //       {
      //         url: post.coverImage,
      //         width: 1200,
      //         height: 630,
      //         alt: post.title,
      //       },
      //     ]
      //   : [],
    },
  };
}

export default async function PostDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = (await params).id;
  const post = await getCachedPost(id);
  if (!post) return <p>文章未找到</p>;

  return (
    <article className="mx-auto max-w-4xl px-6">
      <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-white/90 to-white/80 p-8 shadow-lg">
        <h1 className="mb-2 text-4xl font-bold text-gray-900 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center space-x-4 text-gray-600">
          <time
            dateTime={post.createTime.toString()}
            className="flex items-center space-x-1"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>
              {new Date(post.createTime).toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </span>
          </time>
          {post.category && (
            <span className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full text-sm text-gray-700">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <span>{post.category.name}</span>
            </span>
          )}
        </div>
      </div>
      <div className="prose prose-lg max-w-none">
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-white/90 to-white/80 p-8 shadow-lg">
          <Editor defaultValue={post.content} editable={false} />
        </div>
      </div>
    </article>
  );
}
