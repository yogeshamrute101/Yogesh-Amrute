export type LogicOperator =
  | "AND"
  | "OR"
  | "NOT"
  | "IF"
  | "THEN"
  | "UNLESS"
  | "REQUIRES"
  | "BLOCKS";

export type LogicResult =
  | "TRUE"
  | "FALSE"
  | "UNKNOWN"
  | "BLOCKED"
  | "NEEDS_REVIEW";

export interface LogicCondition {
  id: string;
  description: string;
  evaluate: () => boolean | Promise<boolean>;
}

export interface LogicRule {
  id: string;
  name: string;
  operator: LogicOperator;
  conditions: LogicCondition[];
  requiresApproval?: boolean;
}

export interface LogicEvaluation {
  ruleId: string;
  result: LogicResult;
  reason: string;
  evaluatedAt: string;
}

export class LogicControl {
  async evaluateRule(rule: LogicRule): Promise<LogicEvaluation> {
    const values: boolean[] = [];

    for (const condition of rule.conditions) {
      try {
        values.push(await condition.evaluate());
      } catch {
        return {
          ruleId: rule.id,
          result: "UNKNOWN",
          reason: `Condition could not be evaluated: ${condition.description}`,
          evaluatedAt: new Date().toISOString(),
        };
      }
    }

    let result = false;

    switch (rule.operator) {
      case "AND":
      case "REQUIRES":
        result = values.length > 0 && values.every(Boolean);
        break;

      case "OR":
        result = values.some(Boolean);
        break;

      case "NOT":
      case "UNLESS":
        result = !values.some(Boolean);
        break;

      case "IF":
      case "THEN":
        result = values.every(Boolean);
        break;

      case "BLOCKS":
        result = !values.some(Boolean);
        break;
    }

    if (!result) {
      return {
        ruleId: rule.id,
        result: rule.requiresApproval ? "NEEDS_REVIEW" : "BLOCKED",
        reason: `Logic rule "${rule.name}" was not satisfied.`,
        evaluatedAt: new Date().toISOString(),
      };
    }

    return {
      ruleId: rule.id,
      result: "TRUE",
      reason: `Logic rule "${rule.name}" satisfied.`,
      evaluatedAt: new Date().toISOString(),
    };
  }

  async evaluateAll(rules: LogicRule[]): Promise<LogicEvaluation[]> {
    const results: LogicEvaluation[] = [];

    for (const rule of rules) {
      results.push(await this.evaluateRule(rule));
    }

    return results;
  }

  canExecute(results: LogicEvaluation[]): boolean {
    return results.every(
      (result) =>
        result.result === "TRUE"
    );
  }
}
