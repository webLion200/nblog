"use client";
import { ArrowUpFromLine, MessageSquareMore, Pencil } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
const commonButtonClasses =
  "size-8 rounded-2xl bg-white flex items-center justify-center cursor-pointer hover:scale-125 duration-300";

export default function Tools() {
  const { id } = useParams();

  return (
    <div className="space-y-3">
      <Link href={`/post/edit/${id}`} className={commonButtonClasses}>
        <Pencil size={16} strokeWidth={3} className="text-gray-500 font-bold" />
      </Link>
      <div
        className={commonButtonClasses}
        onClick={() => toast("暂未开发,尽请期待")}
      >
        <MessageSquareMore
          size={16}
          strokeWidth={3}
          className="text-gray-500 font-bold"
        />
      </div>
      <div
        className={commonButtonClasses}
        onClick={() => scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUpFromLine
          size={16}
          strokeWidth={3}
          className="text-gray-500 font-bold"
        />
      </div>
    </div>
  );
}
