import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ServerPaginationProps {
  currentPage: number;
  totalPages: number;
  className?: string;
}

const MAX_VISIBLE_PAGES = 5;

export async function Pagination({
  currentPage,
  totalPages,
  className,
}: ServerPaginationProps) {
  // 生成页码范围
  const getPageNumbers = () => {
    if (totalPages <= MAX_VISIBLE_PAGES) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    return [
      1,
      ...(start > 2 ? ["ellipsis"] : []),
      ...Array.from({ length: end - start + 1 }, (_, i) => start + i),
      ...(end < totalPages - 1 ? ["ellipsis"] : []),
      totalPages,
    ];
  };

  return totalPages > 0 ? (
    <nav className={cn("flex items-center justify-center gap-2", className)}>
      {/* 上一页 */}
      <Link
        href={`?page=${currentPage - 1}`}
        className={cn(
          "flex h-9 items-center justify-center rounded-md border px-2",
          currentPage === 1
            ? "pointer-events-none opacity-50"
            : "hover:bg-accent"
        )}
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </Link>

      {/* 页码 */}
      {getPageNumbers().map((page, index) => (
        <div key={index} className="flex items-center">
          {page === "ellipsis" ? (
            <span className="h-9 px-3 flex items-center">...</span>
          ) : (
            <Link
              href={`?page=${page}`}
              className={cn(
                "h-9 px-3 flex items-center justify-center rounded-md border",
                page === currentPage
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              )}
            >
              {page}
            </Link>
          )}
        </div>
      ))}

      {/* 下一页 */}
      <Link
        href={`?page=${currentPage + 1}`}
        className={cn(
          "flex h-9 items-center justify-center rounded-md border px-2",
          currentPage === totalPages
            ? "pointer-events-none opacity-50"
            : "hover:bg-accent"
        )}
      >
        <ChevronRightIcon className="h-4 w-4" />
      </Link>
    </nav>
  ) : null;
}
