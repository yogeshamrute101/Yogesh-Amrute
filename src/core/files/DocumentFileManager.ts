import { existsSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

export type GeneratedFileType =
  | "document"
  | "report"
  | "configuration"
  | "log"
  | "data"
  | "text";

export interface GeneratedFile {
  name: string;
  path: string;
  type: GeneratedFileType;
  createdAt: string;
  size: number;
}

export class DocumentFileManager {
  private root: string;

  constructor(root = "docs/generated") {
    this.root = root;
    mkdirSync(this.root, { recursive: true });
  }

  save(
    name: string,
    content: string,
    type: GeneratedFileType = "document"
  ): GeneratedFile {
    const safeName = name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = join(this.root, safeName);

    writeFileSync(path, content, "utf8");

    return {
      name: safeName,
      path,
      type,
      createdAt: new Date().toISOString(),
      size: Buffer.byteLength(content, "utf8"),
    };
  }

  exists(name: string): boolean {
    return existsSync(join(this.root, name));
  }

  read(name: string): string {
    return readFileSync(join(this.root, name), "utf8");
  }

  saveReport(title: string, sections: Record<string, string>): GeneratedFile {
    const content = [
      `# ${title}`,
      "",
      `Generated: ${new Date().toISOString()}`,
      "",
      ...Object.entries(sections).flatMap(([key, value]) => [
        `## ${key}`,
        "",
        value,
        "",
      ]),
    ].join("\n");

    return this.save(
      `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`,
      content,
      "report"
    );
  }
}
