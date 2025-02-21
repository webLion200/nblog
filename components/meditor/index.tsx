"use client";
import "./editor.css";
import "./prosemirror.css";

import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import { useDebouncedCallback } from "use-debounce";
import { Editor as EditorClass } from "@tiptap/core";
import { useCallback, useEffect } from "react";
import { defaultExtensions } from "./extensions";
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
  onDebouncedUpdate?: (editor?: EditorClass) => void | Promise<void>;
  /**
   * The duration (in milliseconds) to debounce the onDebouncedUpdate callback.
   * Defaults to 750.
   */
  debounceDuration?: number;
}

export default function Editor({
  defaultValue = "",
  onDebouncedUpdate = () => {},
  debounceDuration = 750,
}: IEditor) {
  const debouncedUpdates = useDebouncedCallback(async ({ editor }) => {
    onDebouncedUpdate(editor);
  }, debounceDuration);

  const editor = useEditor({
    extensions: defaultExtensions,
    content: `
        <h1>This is a 1st level heading</h1>
        <h2>This is a 2nd level heading</h2>
        <h3>This is a 3rd level heading</h3>
        <h4>This 4th level heading will be converted to a paragraph, because levels are configured to be only 1, 2 or 3.</h4>
      <img src="https://img2022.cnblogs.com/blog/1216658/202203/1216658-20220324200930356-377823026.png" alt="" width="200" height="300"/>
        `,
    onUpdate: (e) => {
      debouncedUpdates(e);
    },
    immediatelyRender: false,
  });

  const addImage = useCallback(() => {
    console.log("addImage", editor);
    // const url = window.prompt("URL");
    // debugger;
    // if (url) {
    // }
    editor
      ?.chain()
      .focus()
      .setImage({
        src: "https://iskzuogcmkzumadqjnbv.supabase.co/storage/v1/object/public/posts/banner/banners.png",
      })
      .run();
  }, [editor]);

  // hydrate the editor with the defaultValue.
  useEffect(() => {
    if (!editor) return;

    if (defaultValue) {
      editor.commands.setContent(defaultValue);
    }
  }, [editor, defaultValue]);

  if (!editor) return;

  return (
    <div
      onClick={() => {
        editor?.chain().focus().run();
      }}
      className="relative min-h-[500px] w-full max-w-screen-lg border-stone-200 bg-white sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg"
    >
      <div className="control-group">
        <ImageUp />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
