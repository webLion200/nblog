"use client";
import { useState } from "react";
import Editor from "@/components/meditor";
import { createBlog } from "./actions";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createBlog({
      title,
      content,
    });
    console.log("result", result);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">创建博客</h1>
      <form className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="标题"
          className="border p-2 w-full"
        />

        <Editor
          onDebouncedUpdate={(content) => {
            console.log("content", content);
            setContent(content);
          }}
        />
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-blue-500 text-white p-2 w-full"
        >
          发布文章
        </button>
      </form>
    </div>
  );
}
