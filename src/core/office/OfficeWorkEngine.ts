export type OfficeArtifact =
  | "DOCUMENT"
  | "SPREADSHEET"
  | "PRESENTATION"
  | "PDF"
  | "FORM"
  | "REPORT"
  | "TEMPLATE"
  | "PPD";

export class OfficeWorkEngine {
  understand(type: OfficeArtifact, metadata: Record<string, unknown> = {}) {
    return {
      type,
      metadata,
      operations: [
        "CREATE",
        "READ",
        "UNDERSTAND",
        "EDIT",
        "FORMAT",
        "VALIDATE",
        "EXPORT",
      ],
    };
  }
}
