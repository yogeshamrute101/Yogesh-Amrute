import type { Entry } from "../entries/EntryRegistry";

export type DifferenceType =
  | "same"
  | "similar"
  | "different"
  | "duplicate"
  | "new"
  | "missing"
  | "uncertain";

export type DifferenceResult = {
  type: DifferenceType;
  confidence: number;
  reason: string;
  relatedIds: string[];
};

export class DifferentiationEngine {
  compare(a: Entry, b: Entry): DifferenceResult {
    if (a.id === b.id) {
      return {
        type: "same",
        confidence: 1,
        reason: "Same unique entry ID.",
        relatedIds: [a.id]
      };
    }

    if (a.type === b.type && a.name.toLowerCase() === b.name.toLowerCase()) {
      return {
        type: "similar",
        confidence: 0.95,
        reason: "Same type and normalized name.",
        relatedIds: [a.id, b.id]
      };
    }

    return {
      type: "different",
      confidence: 0.8,
      reason: "Entries have different identity characteristics.",
      relatedIds: [a.id, b.id]
    };
  }

  classify(entry: Entry, existing: Entry[]) {
    const matches = existing.filter(x =>
      x.id === entry.id ||
      (
        x.type === entry.type &&
        x.name.toLowerCase() === entry.name.toLowerCase()
      )
    );

    if (matches.length === 0) {
      return {
        ...entry,
        status: "new" as const
      };
    }

    if (matches.some(x => x.id === entry.id)) {
      return {
        ...entry,
        status: "existing" as const
      };
    }

    return {
      ...entry,
      status: "needs-review" as const
    };
  }
}
