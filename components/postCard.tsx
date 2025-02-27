"use client";
import { CalendarDays, Eye, Flag, MessageCircleMore } from "lucide-react";
import dayjs from "dayjs";
import { useState } from "react";
import Link from "next/link";

interface PostCardProps {
  data: {
    postTags: { id: string; value: string; label: string }[];
    category: { name: string; id: string } | null;
    author: { id: string; username: string };
    id: string;
    content: string;
    summary: string;
    authorId: string;
    published: boolean;
    categoryId: string | null;
    title: string;
    createTime: Date;
  };
}

export default function PostCard({ data }: PostCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      key={data.id}
      className="relative card py-10 border-b-4 border-blue-400 border-dashed"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="text-3xl text-black pb-2 border-b-1 border-gray-100 hover:border-blue-400 hover:text-blue-400">
        <Link href={`/posts/${data.id}`}>{data.title}</Link>
      </div>

      <div className="flex text-sm py-2 space-x-4 text-[12px] text-gray-600">
        <div className="flex items-center border-r-2 border-gray-400 pr-4">
          <CalendarDays size={16} className="mr-1" />
          {dayjs(data.createTime).format("YYYY-MM-DD hh:mm")}
        </div>
        <div className="flex items-center border-r-2 border-gray-400 pr-4">
          <Eye size={16} className="mr-1" />
          15
        </div>
        <div className="flex items-center  border-gray-400 pr-4">
          <MessageCircleMore size={16} className="mr-1" />
          20
        </div>
      </div>
      <Flag
        size={18}
        strokeWidth={2}
        absoluteStrokeWidth
        className={`absolute bottom-0 text-blue-400 font-bold transition-all duration-2000 ease-in ${
          isHovered ? "left-[calc(100%-18px)]" : "left-0"
        }`}
        style={{
          transitionTimingFunction: "cubic-bezier(0.4, 0, 1, 1)", // 更明显的加速曲线
        }}
      />
      <div className="">{data.summary}</div>
    </div>
  );
}
