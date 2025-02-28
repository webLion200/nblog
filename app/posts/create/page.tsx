import PostForm from "@/components/posts/post-form";

export default function CreatePost() {
  return (
    <div className="container mx-auto bg-white">
      <div className="relative flex flex-col h-screen">
        <h1 className="sticky left-0 right-0 top-0 px-[10px] py-10 text-2xl font-bold  bg-white z-10">
          创建博客
        </h1>
        <PostForm />
      </div>
    </div>
  );
}
