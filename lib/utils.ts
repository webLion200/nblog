import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { remark } from "remark";
import strip from "strip-markdown";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 从 Markdown 文本提取纯文本摘要
 * @param markdownContent 博客的 Markdown 内容
 * @param length 截取的摘要长度，默认为 200
 * @returns 纯文本摘要
 */
export async function extractSummary(
  markdownContent: string,
  length: number = 500
): Promise<string> {
  const processedContent = await remark().use(strip).process(markdownContent);
  const textContent = processedContent.toString().trim();

  // 截取前 length 个字符，避免破坏单词结构
  return textContent.length > length
    ? textContent.slice(0, length) + "..."
    : textContent;
}
