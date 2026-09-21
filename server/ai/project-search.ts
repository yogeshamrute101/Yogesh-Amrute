import fs from "fs/promises";
import path from "path";

export interface ProjectSearchResult {
  file: string;
  score: number;
  content: string;
}

const aggregatePath = path.join(
  process.cwd(),
  "aggregation",
  "project-aggregate.txt"
);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9_./-]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 2);
}

function parseSections(knowledge: string) {
  const matches = knowledge.match(
    /===== ([^\n]+?) =====\n([\s\S]*?)(?=\n===== |\s*$)/g
  ) ?? [];

  return matches.map((section) => {
    const match = section.match(
      /^===== ([^\n]+?) =====\n([\s\S]*)$/
    );

    return {
      file: match?.[1]?.trim() ?? "unknown",
      content: match?.[2] ?? "",
    };
  });
}

export async function searchProject(
  query: string,
  limit = 8
): Promise<ProjectSearchResult[]> {
  const cleanQuery = query.trim();

  if (!cleanQuery) {
    return [];
  }

  const knowledge = await fs.readFile(aggregatePath, "utf8");
  const sections = parseSections(knowledge);

  const queryTokens = tokenize(cleanQuery);

  const results = sections
    .map((section) => {
      const fileLower = section.file.toLowerCase();
      const searchable = `${section.file}\n${section.content}`.toLowerCase();

      let score = 0;

      for (const token of queryTokens) {
        if (fileLower.includes(token)) {
          score += 10;
        }

        if (searchable.includes(token)) {
          score += 2;
        }
      }

      if (searchable.includes(cleanQuery.toLowerCase())) {
        score += 20;
      }

      return {
        file: section.file,
        score,
        content: section.content,
      };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return results;
}
