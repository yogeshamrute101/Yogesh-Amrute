export type AgentMode =
  | "OBSERVE"
  | "ANALYZE"
  | "FIX"
  | "VERIFY"
  | "EXPLAIN";

export interface AgentResult {
  mode: AgentMode;
  status: "SUCCESS" | "NEEDS_INPUT" | "BLOCKED";
  summary: string;
  actions: string[];
  nextCommand?: string;
  evidence?: string[];
}

export class FastProjectAgent {
  private mode: AgentMode = "OBSERVE";

  observe(evidence: string[]): AgentResult {
    this.mode = "ANALYZE";

    if (!evidence.length) {
      return {
        mode: this.mode,
        status: "NEEDS_INPUT",
        summary: "No project evidence available.",
        actions: ["Inspect the relevant file, error, and surrounding code."],
      };
    }

    return {
      mode: this.mode,
      status: "SUCCESS",
      summary: "Project evidence received and ready for analysis.",
      actions: [
        "Identify the exact error.",
        "Locate the smallest affected area.",
        "Preserve existing architecture.",
        "Avoid unnecessary file changes.",
      ],
      evidence,
    };
  }

  plan(error: string, file: string): AgentResult {
    this.mode = "FIX";

    return {
      mode: this.mode,
      status: "SUCCESS",
      summary: `Planning a minimal fix for ${file}.`,
      actions: [
        `Analyze: ${error}`,
        `Inspect surrounding code in ${file}`,
        "Apply the smallest safe change",
        "Run lint",
        "Run build if lint passes",
      ],
      evidence: [error, file],
    };
  }

  verify(): AgentResult {
    this.mode = "VERIFY";

    return {
      mode: this.mode,
      status: "SUCCESS",
      summary: "Verification requested.",
      actions: ["Run lint", "Run build", "Report only verified results"],
    };
  }

  explain(message: string): AgentResult {
    this.mode = "EXPLAIN";

    return {
      mode: this.mode,
      status: "SUCCESS",
      summary: message,
      actions: ["Explain the cause", "Explain the fix", "State verification status"],
    };
  }
}
