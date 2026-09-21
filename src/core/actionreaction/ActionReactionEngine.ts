export type ReactionType =
  | "EXPECTED"
  | "POSITIVE"
  | "NEGATIVE"
  | "NEUTRAL"
  | "UNEXPECTED"
  | "ERROR"
  | "UNKNOWN";

export interface ActionRecord {
  id: string;
  action: string;
  target?: string;
  expectedReaction?: unknown;
  actualReaction?: unknown;
  timestamp: number;
}

export interface ReactionAssessment {
  actionId: string;
  type: ReactionType;
  matchedExpectation: boolean;
  confidence: number;
  nextAction: "CONTINUE" | "ADAPT" | "CORRECT" | "STOP" | "REVIEW";
  reason: string;
}

export class ActionReactionEngine {
  assess(record: ActionRecord): ReactionAssessment {
    if (record.actualReaction === undefined) {
      return {
        actionId: record.id,
        type: "UNKNOWN",
        matchedExpectation: false,
        confidence: 0,
        nextAction: "REVIEW",
        reason: "No observable reaction was provided.",
      };
    }

    const matched =
      record.expectedReaction !== undefined &&
      JSON.stringify(record.expectedReaction) ===
        JSON.stringify(record.actualReaction);

    if (matched) {
      return {
        actionId: record.id,
        type: "EXPECTED",
        matchedExpectation: true,
        confidence: 1,
        nextAction: "CONTINUE",
        reason: "Observed reaction matched the expected reaction.",
      };
    }

    return {
      actionId: record.id,
      type: "UNEXPECTED",
      matchedExpectation: false,
      confidence: 0.5,
      nextAction: "ADAPT",
      reason: "Observed reaction differs from the expectation.",
    };
  }
}
