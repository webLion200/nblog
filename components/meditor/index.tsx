"use client";
import "@/styles/editor.css";
import "@/styles/prosemirror.css";

import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import { useDebouncedCallback } from "use-debounce";
import { useEffect } from "react";
import { defaultExtensions } from "./extensions";
import { defaultEditorProps } from "./props";
import { ImageUp } from "lucide-react";

interface IEditor {
  /**
   * The default value to use for the editor.
   * Defaults to defaultEditorContent.
   */
  defaultValue?: JSONContent | string;
  /**
   * A callback function that is called whenever the editor is updated, but only after the defined debounce duration.
   * Defaults to () => {}.
   */
  onDebouncedUpdate?: (content: string) => void | Promise<void>;
  /**
   * The duration (in milliseconds) to debounce the onDebouncedUpdate callback.
   * Defaults to 750.
   */
  debounceDuration?: number;
  editable?: boolean;
}

export default function Editor({
  defaultValue = "",
  onDebouncedUpdate = () => {},
  debounceDuration = 750,
  editable = true,
}: IEditor) {
  const debouncedUpdates = useDebouncedCallback(async (content) => {
    onDebouncedUpdate(content);
  }, debounceDuration);

  const editor = useEditor({
    extensions: defaultExtensions,
    editorProps: {
      ...defaultEditorProps,
    },
    onUpdate: ({ editor }) => {
      const markdownContent = editor.storage.markdown.getMarkdown();
      debouncedUpdates(markdownContent);
    },
    immediatelyRender: false,
    editable,
  });

  // hydrate the editor with the defaultValue.
  useEffect(() => {
    if (!editor) return;

    if (defaultValue) {
      editor.commands.setContent(defaultValue);
    }
  }, [editor, defaultValue]);

  // 上传图片函数
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const formData = new FormData();
      formData.append("image", e.target.files?.[0]);
      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const { url } = await response.json();
        // 插入图片时使用绝对路径
        setTimeout(() => {
          editor
            ?.chain()
            .focus()
            .setImage({
              src: url,
            })
            .run();
        }, 100);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  return (
    <div
      onClick={() => {
        editor?.chain().focus().run();
      }}
      className="relative w-full border-stone-200 bg-white sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg"
    >
      <div className="p-6 px-8 sm:px-12 flex justify-end">
        <div className="relative">
          <ImageUp size={32} className="cursor-pointer" />
          <input
            placeholder=""
            type="file"
            accept="image/*"
            name="image"
            onChange={handleImageChange}
            className="cursor-pointer w-8 h-8 absolute top-0 opacity-0"
          />
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
