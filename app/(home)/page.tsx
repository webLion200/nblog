import { prisma } from "@/lib/prisma";
import { postDataInclude } from "@/lib/types";
import PostCard from "@/components/post-card";
import { Pagination } from "@/components/pagination/server-pagination";

type SearchParams = {
  cate?: string;
  page?: string;
};

// 每页显示数量
const ITEMS_PER_PAGE = 10;

export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const _searchParams = await searchParams;
  const currentPage = Math.max(
    1,
    parseInt(
      (Array.isArray(_searchParams?.page)
        ? _searchParams?.page[0]
        : _searchParams?.page) || "1"
    )
  );

  const cateId = _searchParams?.cate || "all";

  // 计算跳过数量
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  const [totalCount, result] = await Promise.all([
    prisma.post.count({
      where: {
        published: true,
        ...(cateId !== "all" && {
          categoryId: cateId,
        }),
      },
    }),
    prisma.post.findMany({
      where: {
        published: true,
        ...(cateId !== "all" && {
          categoryId: cateId,
        }),
      },
      include: postDataInclude,
      orderBy: {
        updateTime: "desc",
      },
      skip,
      take: ITEMS_PER_PAGE,
    }),
  ]);

  const posts = result.map((post) => ({
    ...post,
    tags: post.tags.map((postTag) => postTag.tag),
  }));

  const totalPages = Math.ceil(totalCount / 10);

  return (
    <div className="mx-auto p-6 border-1 border-gray-50 rounded-b-2xl bg-white/90 backdrop-blur-sm">
      <div className="min-h-[calc(100vh-300px)] ">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} data={post} />)
        ) : (
          <div className="h-200 text-gray-500 flex items-center justify-center">
            暂无数据
          </div>
        )}
      </div>
      <div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          className="mt-8"
        />
      </div>
    </div>
  );
}
