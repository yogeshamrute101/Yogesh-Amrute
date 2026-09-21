export type ThreatLevel =
  | "NORMAL"
  | "WARNING"
  | "HIGH"
  | "CRITICAL";

export type ResistanceAction =
  | "ALLOW"
  | "WARN"
  | "BLOCK"
  | "ISOLATE"
  | "SAFE_MODE"
  | "EMERGENCY_STOP"
  | "HUMAN_REVIEW";

export interface SafetyEvent {
  source: string;
  description: string;
  threatLevel: ThreatLevel;
  target?: string;
  evidence?: Record<string, unknown>;
}

export interface ResistanceDecision {
  action: ResistanceAction;
  blocked: boolean;
  reason: string;
  escalationRequired: boolean;
  auditRequired: boolean;
}

export class SafetyResistanceEngine {
  evaluate(event: SafetyEvent): ResistanceDecision {
    switch (event.threatLevel) {
      case "CRITICAL":
        return {
          action: "EMERGENCY_STOP",
          blocked: true,
          reason: "Critical unsafe activity detected.",
          escalationRequired: true,
          auditRequired: true,
        };

      case "HIGH":
        return {
          action: "ISOLATE",
          blocked: true,
          reason: "High-risk activity requires isolation and review.",
          escalationRequired: true,
          auditRequired: true,
        };

      case "WARNING":
        return {
          action: "WARN",
          blocked: false,
          reason: "Potentially unsafe activity detected.",
          escalationRequired: false,
          auditRequired: true,
        };

      default:
        return {
          action: "ALLOW",
          blocked: false,
          reason: "No safety violation detected.",
          escalationRequired: false,
          auditRequired: false,
        };
    }
  }
}
