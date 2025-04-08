import { prisma } from "@/lib/prisma";
import { postDataInclude } from "@/lib/types";
import PostCard from "@/components/post-card";
import { Pagination } from "@/components/pagination/server-pagination";
import { PageProps } from "@/.next/types/app/layout";
import Link from "next/link";

// 每页显示数量
const ITEMS_PER_PAGE = 10;

export default async function HomePage({ searchParams }: PageProps) {
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
  const tagValue = _searchParams?.tag;
  // 计算跳过数量
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  const [totalCount, result] = await Promise.all([
    prisma.post.count({
      where: {
        published: true,
        ...(cateId !== "all" && {
          categoryId: cateId,
        }),
        ...(tagValue && {
          tags: {
            some: {
              tag: {
                value: tagValue,
              },
            },
          },
        }),
      },
    }),
    prisma.post.findMany({
      where: {
        published: true,
        ...(cateId !== "all" && {
          categoryId: cateId,
        }),
        ...(tagValue && {
          tags: {
            some: {
              tag: {
                value: tagValue,
              },
            },
          },
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

  const tags = await prisma.tag.findMany({
    distinct: ["value"],
    select: {
      value: true,
      label: true,
    },
  });

  const posts = result.map((post) => ({
    ...post,
    tags: post.tags.map((postTag) => postTag.tag),
  }));

  const totalPages = Math.ceil(totalCount / 10);

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="flex gap-8">
        {/* 主内容区 */}
        <div className="flex-1 space-y-8">
          <div className="min-h-[calc(100vh-300px)]">
            {posts.length > 0 ? (
              <div className="grid gap-8">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/90 to-white/80 p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <PostCard data={post} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-160 flex-col items-center justify-center space-y-6 rounded-2xl bg-gradient-to-br bg-gray-100 from-white/90 to-white/80 p-8 shadow-lg=">
                <div className="text-7xl">✨</div>
                <div className="text-xl font-medium text-gray-700">
                  No article
                </div>
                <div className="text-sm text-gray-500">
                  Come and post your first blog
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              className="mt-8"
            />
          </div>
        </div>

        {/* 侧边栏 */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* 标签云 */}
            <div className="rounded-2xl bg-gradient-to-br from-white/90 to-white/80 p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
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
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link
                    key={tag.value}
                    href={{
                      pathname: "/",
                      query: {
                        ..._searchParams,
                        tag: tagValue === tag.value ? undefined : tag.value,
                      },
                    }}
                    className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                      tagValue === tag.value
                        ? "bg-gradient-to-r from-blue-100 to-purple-100 text-gray-900"
                        : "bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 hover:from-blue-100 hover:to-purple-100"
                    }`}
                  >
                    {tag.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
