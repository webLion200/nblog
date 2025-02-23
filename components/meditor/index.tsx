"use client";
import "@/styles/editor.css";
import "@/styles/prosemirror.css";

import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import { useDebouncedCallback } from "use-debounce";
import { useEffect } from "react";
import { defaultExtensions } from "./extensions";
import { defaultEditorProps } from "./props";
import { cn } from "@/lib/utils";

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
  className?: string;
}

export default function Editor({
  defaultValue = "",
  onDebouncedUpdate = () => {},
  debounceDuration = 750,
  editable = true,
  className = "",
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

  return (
    <div
      onClick={() => {
        editor?.chain().focus().run();
      }}
      className={cn(
        "relative w-full focus:ring-orange-600 focus:outline-8  border-stone-200 bg-white sm:rounded-lg sm:border sm:shadow-lg",
        className
      )}
    >
      <EditorContent editor={editor} />
    </div>
  );
}
