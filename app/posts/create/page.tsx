"use client";
import { useState, useTransition } from "react";
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

export default function CreatePost() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<PostValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = async (
    data: PostValues,
    event?: React.BaseSyntheticEvent
  ) => {
    debugger;
    if (!event) return;
    // 获取点击的按钮的 value
    const submitType = (event.nativeEvent.submitter as HTMLButtonElement)
      ?.value as BtnType;
    startTransition(async () => {
      const result = await createBlog(
        {
          title: data.title,
          content: data.content,
        },
        submitType
      );
      console.log("result", result);
    });
  };

  return (
    <div className="container mx-auto flex flex-col h-screen p-4">
      <h1 className="text-2xl font-bold mb-4 h-10">创建博客</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data, event) => onSubmit(data, event))}
          className="space-y-4 flex flex-col flex-1"
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
                    className="h-10 border rounded-[6px] p-2 w-full"
                  />
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
            className="flex-1 overflow-y-scroll border min-h-0"
            onDebouncedUpdate={(content) => {
              form.setValue("content", content);
              // setContent(content);
            }}
          />
          <div className="flex space-x-5">
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
        </form>
      </Form>
    </div>
  );
}
