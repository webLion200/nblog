"use client";
import { useEffect, useState, useTransition } from "react";
import Editor from "@/components/meditor";
import { createBlog, BtnType } from "./actions";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, PostValues } from "@/lib/validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TagSelect } from "@/components/tag-select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { CreateCategoryDialog } from "@/components/createCategoryDialog";
import { CategorySelect } from "@/components/category-select";

type Tag = {
  value: string;
  label: string;
  color?: string;
  icon?: React.ReactNode;
};

export default function CreatePost() {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [cateDialogVisible, setCateDialogVisible] = useState(false);

  const [isPending, startTransition] = useTransition();

  const form = useForm<PostValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
      categoryId: "",
    },
  });

  const onSubmit = async (
    data: PostValues,
    event?: React.BaseSyntheticEvent
  ) => {
    if (!event) return;
    // 获取点击的按钮的 value
    const submitType = (
      (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement
    )?.value as BtnType;
    startTransition(async () => {
      await createBlog(
        {
          title: data.title,
          content: data.content,
          tags: data.tags,
          categoryId: data.categoryId,
        },
        submitType
      );
    });
  };

  const changeSelectedTags = (tags: Tag[]) => {
    setSelectedTags(tags);
    const values = tags.map((tag) => tag.value);
    form.setValue("tags", values);
  };

  const changeCategory = (id: string) => {
    if (!id) return;
    setSelectedCategoryId(id);
    form.setValue("categoryId", id);
  };

  const handleTriggerCateDialog = (bool: boolean) => {
    setCateDialogVisible(bool);
  };

  return (
    <div className="container mx-auto ">
      <div className="relative flex flex-col h-screen px-4">
        <h1 className="sticky left-0 right-0 top-0 mx-[-10px] px-[10px] py-10 text-2xl font-bold  bg-white z-10">
          创建博客
        </h1>
        <ScrollArea className="h-[calc(100vh-112px)]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data, event) =>
                onSubmit(data, event)
              )}
              className="space-y-4 flex flex-col flex-1 "
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>标题</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="标题"
                        className="h-10 border rounded-[6px] p-2 max-w-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>标签</FormLabel>
                    <FormControl>
                      <div className="max-w-md space-y-4 relative">
                        <Input
                          {...field}
                          type="hidden"
                          placeholder="内容"
                          className="h-10 border rounded-[6px] p-2 w-full"
                        />
                        <TagSelect
                          selectedTags={selectedTags}
                          onSelectTag={changeSelectedTags}
                        />
                        <span
                          onClick={() => toast("等待开发")}
                          className="text-blue-400 cursor-pointer hover:underline absolute top-[-30px] right-0"
                        >
                          管理标签
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>目录</FormLabel>
                    <FormControl>
                      <div className="max-w-md space-y-4 relative">
                        <Input
                          {...field}
                          type="hidden"
                          placeholder="内容"
                          className="h-10 border rounded-[6px] p-2 w-full"
                        />
                        <span
                          onClick={() => handleTriggerCateDialog(true)}
                          className="text-blue-400 cursor-pointer hover:underline absolute top-[-30px] right-0"
                        >
                          新建目录
                        </span>
                        <CreateCategoryDialog
                          open={cateDialogVisible}
                          onOpenChange={handleTriggerCateDialog}
                        />
                        <CategorySelect
                          selectedId={selectedCategoryId}
                          onSelect={changeCategory}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>内容</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="hidden"
                        placeholder="内容"
                        className="h-10 border rounded-[6px] p-2 w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Editor
                className="flex-1 border"
                onDebouncedUpdate={(content) => {
                  form.setValue("content", content);
                }}
              />
              <div className="fixed top-10 right-30 z-50">
                <div className="flex space-x-5 pr-4">
                  <Button
                    type="submit"
                    name="action"
                    value="saveDraft"
                    className="rounded-[6px] h-10 bg-gray-200 hover:bg-gray-100 cursor-pointer text-red-400 p-2 w-full"
                    disabled={isPending}
                  >
                    存为草稿
                  </Button>
                  <Button
                    type="submit"
                    name="action"
                    value="publish"
                    className="rounded-[6px] h-10 bg-blue-500 hover:bg-blue-400 cursor-pointer text-white p-2 w-full"
                    disabled={isPending}
                  >
                    直接发布
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </div>
    </div>
  );
}
