export type LawLevel =
  | "SYSTEM"
  | "SAFETY"
  | "PRIVACY"
  | "SECURITY"
  | "LEGAL"
  | "REGULATORY"
  | "PROJECT"
  | "USER";

export interface Rule {
  id: string;
  level: LawLevel;
  title: string;
  condition: string;
  action: "ALLOW" | "BLOCK" | "REQUIRE_APPROVAL" | "REVIEW";
  priority: number;
}

export interface LawDecision {
  allowed: boolean;
  action: Rule["action"];
  matchedRules: string[];
  reason: string;
  requiresHumanReview: boolean;
}

export class UniversalLawEngine {
  private rules: Rule[] = [];

  addRule(rule: Rule): void {
    this.rules.push(rule);
    this.rules.sort((a, b) => b.priority - a.priority);
  }

  listRules(): Rule[] {
    return [...this.rules];
  }

  evaluate(context: Record<string, unknown>): LawDecision {
    const matched = this.rules.filter(rule =>
      Object.entries(context).some(
        ([key, value]) =>
          rule.condition.includes(key) &&
          rule.condition.includes(String(value))
      )
    );

    const blocking = matched.find(r => r.action === "BLOCK");
    const approval = matched.find(
      r => r.action === "REQUIRE_APPROVAL"
    );
    const review = matched.find(r => r.action === "REVIEW");

    if (blocking) {
      return {
        allowed: false,
        action: "BLOCK",
        matchedRules: [blocking.id],
        reason: blocking.title,
        requiresHumanReview: true,
      };
    }

    if (approval) {
      return {
        allowed: false,
        action: "REQUIRE_APPROVAL",
        matchedRules: [approval.id],
        reason: approval.title,
        requiresHumanReview: true,
      };
    }

    if (review) {
      return {
        allowed: false,
        action: "REVIEW",
        matchedRules: [review.id],
        reason: review.title,
        requiresHumanReview: true,
      };
    }

    return {
      allowed: true,
      action: "ALLOW",
      matchedRules: matched.map(r => r.id),
      reason: "No blocking rule matched.",
      requiresHumanReview: false,
    };
  }
}
