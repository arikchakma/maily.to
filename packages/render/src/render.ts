import type { JSONContent } from '@tiptap/core';
import { Maily } from './maily';
import type { MailyConfig, RenderOptions } from './maily';

export async function render(
  content: JSONContent,
  config?: MailyConfig & RenderOptions
): Promise<string> {
  const { theme, preview, ...rest } = config || {};

  const maily = new Maily(content);
  maily.setPreviewText(preview);
  maily.setTheme(theme || {});

  return maily.render(rest);
}

export async function htmlToPlainText(html: string): string {
  let text = html;

  // Replace <br> and <br/> with newlines                                                                           
  text = text.replace(/<br\s*\/?>/gi, "\n");

  // Replace <hr> with separator                                                   
  text = text.replace(/<hr\s*\/?>/gi, "\n---\n");

  // Replace block-level closing tags with newlines
  text = text.replace(
    /<\/(p|div|h[1-6]|li|tr|blockquote|section|article|header|footer)>/gi,
    "\n",
  );

  // Convert links: <a href="url">text</a> → "text (url)"
  text = text.replace(
    /<a\s[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi,
    (_, url: string, linkText: string) => {
      const cleanLinkText = linkText.replace(/<[^>]*>/g, "").trim();
      if (!cleanLinkText || cleanLinkText === url) {
        return url;
      }
      return `${cleanLinkText} (${url})`;
    },
  );

  // Strip all remaining HTML tags
  text = text.replace(/<[^>]*>/g, "");

  // Decode common HTML entities
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCharCode(Number.parseInt(code, 10)),
    )
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) =>
      String.fromCharCode(Number.parseInt(hex, 16)),
    );

  // Normalize whitespace: collapse multiple spaces on the same line
  text = text.replace(/[ \t]+/g, " ");

  // Collapse 3+ consecutive newlines to 2
  text = text.replace(/\n{3,}/g, "\n\n");

  // Trim each line
  text = text
    .split("\n")
    .map((line) => line.trim())
    .join("\n");

  return text.trim();
}