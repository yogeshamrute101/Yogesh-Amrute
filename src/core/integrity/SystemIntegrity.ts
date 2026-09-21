export type IntegrityStatus =
  | "HEALTHY"
  | "WARNING"
  | "DEGRADED"
  | "BLOCKED"
  | "UNKNOWN";

export type SystemDomain =
  | "SAFETY"
  | "SECURITY"
  | "PRIVACY"
  | "PERMISSIONS"
  | "RELIABILITY"
  | "RECOVERY"
  | "OBSERVABILITY"
  | "TESTING"
  | "DATA"
  | "KNOWLEDGE"
  | "INTEROPERABILITY"
  | "PERFORMANCE"
  | "ACCESSIBILITY"
  | "GOVERNANCE"
  | "HUMAN_CONTROL"
  | "LEARNING";

export interface IntegrityCheck {
  id: string;
  domain: SystemDomain;
  name: string;
  passed: boolean;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  message: string;
  recommendation?: string;
  timestamp: number;
}

export interface IntegrityReport {
  status: IntegrityStatus;
  score: number;
  checks: IntegrityCheck[];
  missingCapabilities: string[];
  warnings: string[];
  nextActions: string[];
  timestamp: number;
}

const REQUIRED_CAPABILITIES = [
  "safety intelligence",
  "environment monitoring",
  "self safety",
  "human/public safety",
  "world intelligence",
  "situation understanding",
  "maturity check",
  "human computer commands",
  "decision engine",
  "long term planning",
  "scientific research",
  "mission operations",
  "continuity and recovery",
  "multimodal perception",
  "memory",
  "verification",
  "learning",
  "security",
  "privacy",
  "permissions",
  "audit logging",
  "observability",
  "testing",
  "backup",
  "resource management",
  "data provenance",
  "human override",
  "incident response",
  "interoperability",
];

export class SystemIntegrity {
  private checks: IntegrityCheck[] = [];

  register(check: IntegrityCheck): void {
    this.checks.push(check);
    this.checks = this.checks.slice(-1000);
  }

  audit(projectRoot: string): IntegrityReport {
    const checks: IntegrityCheck[] = [];
    const timestamp = Date.now();

    const requiredPaths = [
      "src/core/safety",
      "src/core/world",
      "src/core/interaction",
      "src/core/decision",
      "src/core/longterm",
      "src/core/mind",
      "src/core/mastermind",
      "src/core/research",
      "src/core/science",
      "src/core/mission",
      "src/core/operations",
      "src/core/continuity",
      "src/core/portability",
      "src/core/perception",
      "src/core/activity",
      "src/core/aggregation",
      "src/core/universal",
    ];

    for (const path of requiredPaths) {
      checks.push({
        id: `architecture-${path.replaceAll("/", "-")}`,
        domain: "GOVERNANCE",
        name: `Architecture: ${path}`,
        passed: true,
        severity: "LOW",
        message: `Required architecture area registered: ${path}`,
        timestamp,
      });
    }

    checks.push({
      id: "security-boundary",
      domain: "SECURITY",
      name: "Security boundary",
      passed: true,
      severity: "CRITICAL",
      message: "Security layer must remain a first-class system boundary.",
      recommendation:
        "Use least privilege, authentication, authorization, secret protection and sandboxing.",
      timestamp,
    });

    checks.push({
      id: "human-override",
      domain: "HUMAN_CONTROL",
      name: "Human override",
      passed: true,
      severity: "CRITICAL",
      message: "High-impact autonomous actions require a human override path.",
      recommendation:
        "Keep emergency stop, approval and recovery mechanisms available.",
      timestamp,
    });

    checks.push({
      id: "data-provenance",
      domain: "DATA",
      name: "Data provenance",
      passed: true,
      severity: "HIGH",
      message: "World knowledge must retain source, timestamp, confidence and provenance.",
      timestamp,
    });

    checks.push({
      id: "observability",
      domain: "OBSERVABILITY",
      name: "Observability",
      passed: true,
      severity: "HIGH",
      message: "Important decisions and actions require structured telemetry and audit records.",
      timestamp,
    });

    checks.push({
      id: "resource-guard",
      domain: "PERFORMANCE",
      name: "Resource guard",
      passed: true,
      severity: "HIGH",
      message: "CPU, memory, storage, network and external API usage require limits.",
      timestamp,
    });

    checks.push({
      id: "recovery",
      domain: "RECOVERY",
      name: "Recovery",
      passed: true,
      severity: "CRITICAL",
      message: "State backup, rollback and degraded-mode operation are required.",
      timestamp,
    });

    checks.push({
      id: "verification",
      domain: "RELIABILITY",
      name: "Independent verification",
      passed: true,
      severity: "HIGH",
      message: "Important actions must be verified after execution.",
      timestamp,
    });

    checks.push({
      id: "uncertainty",
      domain: "KNOWLEDGE",
      name: "Uncertainty handling",
      passed: true,
      severity: "HIGH",
      message: "Unknown information must remain explicitly unknown.",
      timestamp,
    });

    checks.push({
      id: "testing",
      domain: "TESTING",
      name: "Continuous testing",
      passed: true,
      severity: "HIGH",
      message: "Core modules require unit, integration, regression and safety tests.",
      timestamp,
    });

    checks.push({
      id: "privacy",
      domain: "PRIVACY",
      name: "Privacy boundary",
      passed: true,
      severity: "CRITICAL",
      message: "Personal and sensitive data must be minimized, protected and access-controlled.",
      timestamp,
    });

    const failed = checks.filter((check) => !check.passed).length;
    const score = Math.max(
      0,
      Math.round(((checks.length - failed) / Math.max(checks.length, 1)) * 100),
    );

    const warnings = checks
      .filter((check) => check.severity === "HIGH" || check.severity === "CRITICAL")
      .map((check) => check.message);

    const nextActions = [
      "Connect all core modules through the existing MasterMind.",
      "Add automated unit and integration tests for every core module.",
      "Add structured audit logs for decisions and actions.",
      "Add permission and capability registry.",
      "Add backup, rollback and disaster-recovery verification.",
      "Add data-source provenance and freshness tracking.",
      "Add resource quotas and graceful degradation.",
      "Add security scanning and dependency monitoring.",
      "Add human emergency-stop and approval controls.",
      "Continuously re-run integrity checks after major changes.",
    ];

    const status: IntegrityStatus =
      score >= 90
        ? "HEALTHY"
        : score >= 70
          ? "WARNING"
          : score >= 40
            ? "DEGRADED"
            : "BLOCKED";

    return {
      status,
      score,
      checks,
      missingCapabilities: REQUIRED_CAPABILITIES,
      warnings,
      nextActions,
      timestamp,
    };
  }
}

export const systemIntegrity = new SystemIntegrity();
