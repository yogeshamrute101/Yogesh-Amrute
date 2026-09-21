export type KnowledgeStatus =
  | "FACT"
  | "MEASURED"
  | "INFERENCE"
  | "HYPOTHESIS"
  | "UNKNOWN";

export type KnowledgeItem = {
  statement: string;
  status: KnowledgeStatus;
  confidence: number;
  source?: string;
};

export class TruthUncertaintyLayer {
  classify(item: KnowledgeItem) {
    return {
      ...item,
      confidence: Math.max(0, Math.min(1, item.confidence))
    };
  }

  isKnown(item: KnowledgeItem) {
    return item.status !== "UNKNOWN";
  }
}
