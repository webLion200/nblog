import { Extensions, mergeAttributes } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageResize from "tiptap-extension-resize-image";
import Placeholder from "@tiptap/extension-placeholder";
import SlashCommand from "./slash-command";
import TextStyle from "@tiptap/extension-text-style";
import TiptapUnderline from "@tiptap/extension-underline";
import { Color } from "@tiptap/extension-color";
import { Markdown } from "tiptap-markdown";
import TaskItem from "@tiptap/extension-task-item";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import Image from "@tiptap/extension-image";
// import CodeBlock from "@tiptap/extension-code-block";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";

const lowlight = createLowlight(all);
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      referrerpolicy: {
        default: "no-referrer",
      },
    };
  },
  renderHTML({ node, HTMLAttributes }) {
    return [
      "img",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        referrerpolicy: "no-referrer", // 强制添加 referrerpolicy
      }),
    ];
  },
});

export const defaultExtensions: Extensions = [
  StarterKit.configure({
    bulletList: {
      HTMLAttributes: {
        class: "list-disc list-outside leading-3 -mt-2",
      },
    },
    orderedList: {
      HTMLAttributes: {
        class: "list-decimal list-outside leading-3 -mt-2",
      },
    },
    listItem: {
      HTMLAttributes: {
        class: "leading-normal -mb-2",
      },
    },
    blockquote: {
      HTMLAttributes: {
        class: "border-l-4 border-stone-700",
      },
    },
    code: {
      HTMLAttributes: {
        class:
          "rounded-md bg-gray-100 px-1.5 py-1 font-mono text-red-600 text-sm",
      },
    },
    // codeBlock: {
    //   HTMLAttributes: {
    //     class: "bg-gray-800 text-gray-100 p-4 rounded-lg",
    //   },
    // },
    codeBlock: false,
    horizontalRule: false,
    dropcursor: {
      color: "#DBEAFE",
      width: 4,
    },
    gapcursor: false,
  }),
  ImageResize,
  CustomImage,
  SlashCommand,
  TiptapUnderline,
  TextStyle,
  Color,
  // CodeBlock.configure({
  //   HTMLAttributes: {
  //     class: "hljs",
  //   },
  //   languageClassPrefix: "language-",
  // }),
  CodeBlockLowlight.configure({
    lowlight,
  }),
  Highlight.configure({
    multicolor: true,
  }),
  TaskList.configure({
    HTMLAttributes: {
      class: "not-prose pl-2",
    },
  }),
  TaskItem.configure({
    HTMLAttributes: {
      class: "flex items-start my-4",
    },
    nested: true,
  }),
  Placeholder.configure({
    placeholder: ({ node }) => {
      const nodeName = node.type.name;
      if (nodeName === "heading") {
        return `Heading ${node.attrs.level}`;
      }
      if (
        nodeName === "bulletList" ||
        nodeName === "orderedList" ||
        nodeName === "listItem"
      ) {
        return "";
      }
      return "Press '/' for commands";
    },
    includeChildren: true,
  }),
  Markdown.configure({
    html: false, // 禁用 HTML 解析
    breaks: true, // 转换换行符为 <br>
    linkify: true, // 自动转换 URL 为链接
    transformPastedText: true, // 转换粘贴的文本
    transformCopiedText: true, // 转换复制的文本
  }),
];
