export type SocialMode =
  | "CONVINCE"
  | "CARE"
  | "FRIENDSHIP"
  | "GUIDANCE"
  | "BOUNDARY"
  | "SAFETY_INTERVENTION";

export interface SocialContext {
  situation: string;
  personGoal?: string;
  systemGoal?: string;
  consentAvailable?: boolean;
  riskLevel?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  relationship?: "NEW" | "KNOWN" | "TRUSTED";
}

export interface SocialResponse {
  mode: SocialMode;
  message: string;
  reasons: string[];
  respectAutonomy: boolean;
  requiresHumanApproval: boolean;
}

export class SocialInteractionEngine {
  respond(
    mode: SocialMode,
    context: SocialContext
  ): SocialResponse {
    const risk = context.riskLevel ?? "LOW";

    if (mode === "CONVINCE") {
      return {
        mode,
        message:
          "Present evidence, explain alternatives, listen to the person's reasons, and allow them to decide.",
        reasons: [
          "Use evidence rather than deception.",
          "Acknowledge disagreement.",
          "Do not manipulate or threaten.",
        ],
        respectAutonomy: true,
        requiresHumanApproval: false,
      };
    }

    if (mode === "CARE") {
      return {
        mode,
        message:
          "Identify the person's needs, offer appropriate support, and check whether help is wanted.",
        reasons: [
          "Listen before acting.",
          "Respect privacy and boundaries.",
          "Escalate serious risks appropriately.",
        ],
        respectAutonomy: true,
        requiresHumanApproval: risk === "CRITICAL",
      };
    }

    if (mode === "FRIENDSHIP") {
      return {
        mode,
        message:
          "Maintain respectful, consistent and supportive interaction without pretending to be a human.",
        reasons: [
          "Remember relevant preferences with permission.",
          "Be reliable and honest.",
          "Respect boundaries and disagreement.",
        ],
        respectAutonomy: true,
        requiresHumanApproval: false,
      };
    }

    if (mode === "BOUNDARY") {
      return {
        mode,
        message:
          "Clearly communicate the boundary and refuse unsafe or unauthorized actions.",
        reasons: [
          "Safety and authorization take priority.",
          "Explain the reason when possible.",
          "Offer a safe alternative.",
        ],
        respectAutonomy: true,
        requiresHumanApproval: risk === "CRITICAL",
      };
    }

    if (mode === "SAFETY_INTERVENTION") {
      return {
        mode,
        message:
          "Take the minimum necessary authorized action to reduce immediate risk, while preserving human control.",
        reasons: [
          "Use the least intrusive intervention.",
          "Do not use coercion merely to obtain compliance.",
          "Escalate when the situation exceeds system authority.",
        ],
        respectAutonomy: true,
        requiresHumanApproval: risk === "HIGH" || risk === "CRITICAL",
      };
    }

    return {
      mode: "GUIDANCE",
      message:
        "Explain the situation, provide options, and help the person choose an appropriate action.",
      reasons: ["Guidance should be evidence-based and transparent."],
      respectAutonomy: true,
      requiresHumanApproval: false,
    };
  }
}
