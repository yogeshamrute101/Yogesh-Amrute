export type DocumentType =
  | "WORD"
  | "PDF"
  | "REPORT"
  | "FORM"
  | "RECORD"
  | "SOP"
  | "PPD"
  | "UNKNOWN";

export interface DocumentStructure {
  title?: string;
  sections: string[];
  tables: string[];
  references: string[];
  metadata: Record<string, unknown>;
}

export class DocumentUnderstandingEngine {
  inspect(type: DocumentType, structure: DocumentStructure) {
    return {
      type,
      structure,
      traceable: true,
      needsSourceVerification: type === "PDF" || type === "UNKNOWN",
    };
  }
}
