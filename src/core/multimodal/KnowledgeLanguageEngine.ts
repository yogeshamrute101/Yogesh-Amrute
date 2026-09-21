export interface KnowledgeEntry {
  term: string;
  language: string;
  definition?: string;
  synonyms?: string[];
  related?: string[];
  source?: string;
}

export class KnowledgeLanguageEngine {
  understand(entry: KnowledgeEntry) {
    return {
      term: entry.term,
      language: entry.language,
      definition: entry.definition ?? "",
      synonyms: entry.synonyms ?? [],
      related: entry.related ?? [],
      source: entry.source ?? "UNKNOWN",
      verified: Boolean(entry.source),
    };
  }
}
