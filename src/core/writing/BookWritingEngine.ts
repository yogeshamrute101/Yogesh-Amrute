import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export interface BookChapter {
  number: number;
  title: string;
  content: string;
}

export interface Book {
  title: string;
  subtitle?: string;
  author?: string;
  createdAt: string;
  chapters: BookChapter[];
}

export class BookWritingEngine {
  private root = "docs/generated/books";

  constructor() {
    mkdirSync(this.root, { recursive: true });
  }

  createBook(input: {
    title: string;
    subtitle?: string;
    author?: string;
    chapters: Array<{
      title: string;
      content: string;
    }>;
  }): Book {
    return {
      title: input.title,
      subtitle: input.subtitle,
      author: input.author,
      createdAt: new Date().toISOString(),
      chapters: input.chapters.map((chapter, index) => ({
        number: index + 1,
        title: chapter.title,
        content: chapter.content,
      })),
    };
  }

  saveMarkdown(book: Book): string {
    const safeTitle = book.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const content = [
      `# ${book.title}`,
      book.subtitle ? `\n## ${book.subtitle}` : "",
      book.author ? `\n**Author:** ${book.author}` : "",
      `\n*Generated: ${book.createdAt}*`,
      "",
      "---",
      "",
      ...book.chapters.flatMap((chapter) => [
        `# Chapter ${chapter.number}: ${chapter.title}`,
        "",
        chapter.content,
        "",
      ]),
    ].join("\n");

    const path = join(this.root, `${safeTitle || "book"}.md`);
    writeFileSync(path, content, "utf8");

    return path;
  }

  saveMetadata(book: Book): string {
    const safeTitle = book.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const path = join(this.root, `${safeTitle || "book"}.json`);
    writeFileSync(path, JSON.stringify(book, null, 2), "utf8");

    return path;
  }
}
