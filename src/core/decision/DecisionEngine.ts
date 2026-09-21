export type DecisionClass =
  | "GOOD"
  | "BAD"
  | "SAFE"
  | "UNSAFE"
  | "UNCERTAIN"
  | "NEEDS_REVIEW";

export interface DecisionEvidence {
  source: string;
  observation: string;
  confidence?: number;
}

export interface DecisionContext {
  goal?: string;
  rules?: string[];
  constraints?: string[];
  evidence?: DecisionEvidence[];
}

export interface DecisionResult {
  decisionId: string;
  classification: DecisionClass;
  conclusion: string;
  reasons: string[];
  evidence: DecisionEvidence[];
  confidence: number;
  uncertainty: string[];
  requiresHumanApproval: boolean;
  timestamp: number;
}

export class DecisionEngine {
  decide(context: DecisionContext): DecisionResult {
    const evidence = context.evidence ?? [];
    const reasons: string[] = [];
    const uncertainty: string[] = [];

    if (evidence.length === 0) {
      return {
        decisionId: `decision-${Date.now()}`,
        classification: "UNCERTAIN",
        conclusion: "There is not enough evidence to make a reliable decision.",
        reasons: ["No evidence was supplied."],
        evidence: [],
        confidence: 0,
        uncertainty: ["Additional evidence is required."],
        requiresHumanApproval: true,
        timestamp: Date.now(),
      };
    }

    const averageConfidence =
      evidence.reduce(
        (sum, item) => sum + (item.confidence ?? 0),
        0
      ) / evidence.length;

    const negativeSignals = evidence.filter((item) =>
      /harm|danger|unsafe|illegal|damage|error|wrong|risk/i.test(
        `${item.observation}`
      )
    );

    const positiveSignals = evidence.filter((item) =>
      /safe|helpful|correct|healthy|benefit|success|good/i.test(
        `${item.observation}`
      )
    );

    let classification: DecisionClass = "UNCERTAIN";
    let conclusion = "Evidence is insufficient for a confident conclusion.";

    if (negativeSignals.length > positiveSignals.length) {
      classification = "BAD";
      conclusion = "Available evidence indicates a potentially harmful or undesirable outcome.";
      reasons.push("Negative or risk-related evidence was detected.");
    } else if (positiveSignals.length > negativeSignals.length) {
      classification = "GOOD";
      conclusion = "Available evidence indicates a beneficial or desirable outcome.";
      reasons.push("Positive or beneficial evidence was detected.");
    } else {
      classification = "NEEDS_REVIEW";
      conclusion = "Evidence contains conflicting or ambiguous signals.";
      reasons.push("Positive and negative evidence could not be reliably separated.");
      uncertainty.push("Conflicting evidence.");
    }

    if (averageConfidence < 0.6) {
      classification = "UNCERTAIN";
      conclusion = "The system cannot make a reliable decision from the current evidence.";
      uncertainty.push("Confidence is below the decision threshold.");
    }

    return {
      decisionId: `decision-${Date.now()}`,
      classification,
      conclusion,
      reasons,
      evidence,
      confidence: averageConfidence,
      uncertainty,
      requiresHumanApproval:
        classification === "BAD" ||
        classification === "UNCERTAIN" ||
        classification === "NEEDS_REVIEW",
      timestamp: Date.now(),
    };
  }
}
