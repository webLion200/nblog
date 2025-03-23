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
    <article className="prose max-w-4xl mx-auto">
      <h1 className=" text-3xl font-bold text-white">{post.title}</h1>
      <div className="pt-8">
        <Editor defaultValue={post.content} editable={false} />
      </div>
    </article>
  );
}
