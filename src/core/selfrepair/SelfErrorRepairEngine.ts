export type ErrorSource =
  | "TYPECHECK"
  | "BUILD"
  | "RUNTIME"
  | "TEST"
  | "NETWORK"
  | "AI"
  | "DEPENDENCY"
  | "CONFIGURATION"
  | "UNKNOWN";

export type RepairStatus =
  | "DETECTED"
  | "DIAGNOSING"
  | "PLANNED"
  | "FIXING"
  | "VERIFYING"
  | "FIXED"
  | "FAILED"
  | "NEEDS_HUMAN";

export interface ErrorEvidence {
  source: ErrorSource;
  message: string;
  file?: string;
  line?: number;
  stack?: string;
  context?: Record<string, unknown>;
}

export interface RepairPlan {
  diagnosis: string;
  probableCauses: string[];
  proposedChanges: string[];
  verificationSteps: string[];
  risk: "LOW" | "MEDIUM" | "HIGH";
}

export interface RepairResult {
  status: RepairStatus;
  diagnosis: string;
  plan: RepairPlan;
  changedFiles: string[];
  verificationPassed: boolean;
  requiresHumanApproval: boolean;
  learned: boolean;
  timestamp: number;
}

export class SelfErrorRepairEngine {
  diagnose(error: ErrorEvidence): RepairPlan {
    return {
      diagnosis: `Analyze ${error.source} error and identify its root cause from available evidence.`,
      probableCauses: [
        "Invalid type or syntax",
        "Incorrect configuration",
        "Dependency mismatch",
        "Runtime state or integration failure",
        "Unexpected input or environment condition",
      ],
      proposedChanges: [
        "Inspect the exact failing file and surrounding context.",
        "Prefer the smallest safe change.",
        "Preserve existing working functionality.",
        "Do not modify unrelated modules.",
      ],
      verificationSteps: [
        "Run the relevant typecheck or test.",
        "Run the production build when applicable.",
        "Confirm the original error is resolved.",
        "Check for regressions.",
        "Record the result.",
      ],
      risk: "LOW",
    };
  }

  async repair(
    error: ErrorEvidence,
    executeFix: (
      plan: RepairPlan
    ) => Promise<{ changedFiles: string[] }>
  ): Promise<RepairResult> {
    const plan = this.diagnose(error);

    if (plan.risk === "HIGH") {
      return {
        status: "NEEDS_HUMAN",
        diagnosis: plan.diagnosis,
        plan,
        changedFiles: [],
        verificationPassed: false,
        requiresHumanApproval: true,
        learned: false,
        timestamp: Date.now(),
      };
    }

    try {
      const result = await executeFix(plan);

      return {
        status: "VERIFYING",
        diagnosis: plan.diagnosis,
        plan,
        changedFiles: result.changedFiles,
        verificationPassed: false,
        requiresHumanApproval: false,
        learned: false,
        timestamp: Date.now(),
      };
    } catch {
      return {
        status: "FAILED",
        diagnosis: plan.diagnosis,
        plan,
        changedFiles: [],
        verificationPassed: false,
        requiresHumanApproval: true,
        learned: false,
        timestamp: Date.now(),
      };
    }
  }
}
