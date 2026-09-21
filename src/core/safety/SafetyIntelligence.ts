export type SafetyDomain =
  | "ENVIRONMENT"
  | "SELF"
  | "HUMAN"
  | "PUBLIC"
  | "INFRASTRUCTURE";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | "UNKNOWN";

export type SafetyAction =
  | "OBSERVE"
  | "WARN"
  | "PREVENT"
  | "ISOLATE"
  | "SAFE_MODE"
  | "RECOVER"
  | "ESCALATE"
  | "REQUEST_APPROVAL"
  | "NO_ACTION";

export interface SafetyObservation {
  id: string;
  domain: SafetyDomain;
  signal: string;
  value?: unknown;
  source?: string;
  timestamp: number;
  confidence: number;
}

export interface SafetyAssessment {
  riskLevel: RiskLevel;
  domains: SafetyDomain[];
  reasons: string[];
  preventiveActions: SafetyAction[];
  correctiveActions: SafetyAction[];
  requiresHumanApproval: boolean;
  confidence: number;
}

export interface SafetyState {
  observations: SafetyObservation[];
  assessment?: SafetyAssessment;
  lastUpdated: number;
}

export class SafetyIntelligence {
  private state: SafetyState = {
    observations: [],
    lastUpdated: Date.now(),
  };

  observe(observation: SafetyObservation): SafetyState {
    this.state.observations.push(observation);
    this.state.observations = this.state.observations.slice(-200);
    this.state.lastUpdated = Date.now();
    return this.state;
  }

  assess(): SafetyAssessment {
    const observations = this.state.observations;
    const reasons: string[] = [];
    const domains = [...new Set(observations.map((o) => o.domain))];

    let riskLevel: RiskLevel = "LOW";
    let confidence = 0;

    for (const observation of observations) {
      confidence = Math.max(confidence, observation.confidence);

      const signal = observation.signal.toLowerCase();

      if (
        signal.includes("fire") ||
        signal.includes("explosion") ||
        signal.includes("toxic") ||
        signal.includes("critical") ||
        signal.includes("life threatening")
      ) {
        riskLevel = "CRITICAL";
        reasons.push(`${observation.domain}: ${observation.signal}`);
      } else if (
        signal.includes("danger") ||
        signal.includes("unsafe") ||
        signal.includes("overheat") ||
        signal.includes("failure")
      ) {
        if (riskLevel !== "CRITICAL") riskLevel = "HIGH";
        reasons.push(`${observation.domain}: ${observation.signal}`);
      } else if (
        signal.includes("warning") ||
        signal.includes("anomaly") ||
        signal.includes("unstable")
      ) {
        if (riskLevel === "LOW") riskLevel = "MEDIUM";
        reasons.push(`${observation.domain}: ${observation.signal}`);
      }
    }

    const preventiveActions: SafetyAction[] = [];
    const correctiveActions: SafetyAction[] = [];

    if (riskLevel === "LOW") {
      preventiveActions.push("OBSERVE");
    }

    if (riskLevel === "MEDIUM") {
      preventiveActions.push("WARN", "PREVENT");
    }

    if (riskLevel === "HIGH") {
      preventiveActions.push("WARN", "ISOLATE", "SAFE_MODE");
      correctiveActions.push("RECOVER");
    }

    if (riskLevel === "CRITICAL") {
      preventiveActions.push("WARN", "ISOLATE", "SAFE_MODE", "ESCALATE");
      correctiveActions.push("RECOVER", "ESCALATE");
    }

    const requiresHumanApproval =
      riskLevel === "HIGH" || riskLevel === "CRITICAL";

    if (requiresHumanApproval) {
      preventiveActions.push("REQUEST_APPROVAL");
    }

    const assessment: SafetyAssessment = {
      riskLevel,
      domains,
      reasons,
      preventiveActions,
      correctiveActions,
      requiresHumanApproval,
      confidence,
    };

    this.state.assessment = assessment;
    this.state.lastUpdated = Date.now();

    return assessment;
  }

  verify(): {
    verified: boolean;
    riskLevel: RiskLevel;
    timestamp: number;
  } {
    const assessment = this.state.assessment;

    return {
      verified: Boolean(assessment),
      riskLevel: assessment?.riskLevel ?? "UNKNOWN",
      timestamp: Date.now(),
    };
  }

  learn(result: {
    outcome: "SUCCESS" | "FAILURE" | "UNKNOWN";
    notes?: string;
  }): void {
    this.observe({
      id: `learning-${Date.now()}`,
      domain: "SELF",
      signal: `Safety learning outcome: ${result.outcome}`,
      value: result.notes,
      source: "SafetyIntelligence",
      timestamp: Date.now(),
      confidence: 1,
    });
  }

  getState(): SafetyState {
    return {
      observations: [...this.state.observations],
      assessment: this.state.assessment,
      lastUpdated: this.state.lastUpdated,
    };
  }
}

export const safetyIntelligence = new SafetyIntelligence();
