export type Horizon =
  | "SHORT_TERM"
  | "MEDIUM_TERM"
  | "LONG_TERM"
  | "FUTURE";

export interface FutureGoal {
  id: string;
  title: string;
  description?: string;
  priority: number;
  horizon: Horizon;
  targetTimestamp?: number;
  dependencies?: string[];
}

export interface FutureRisk {
  id: string;
  description: string;
  probability: number;
  impact: number;
  mitigation?: string;
}

export interface FutureOpportunity {
  id: string;
  description: string;
  potentialBenefit: number;
  requirements?: string[];
}

export interface FutureAction {
  id: string;
  description: string;
  expectedOutcome: string;
  priority: number;
  reversible: boolean;
}

export interface LongTermPlan {
  planId: string;
  goals: FutureGoal[];
  risks: FutureRisk[];
  opportunities: FutureOpportunity[];
  actions: FutureAction[];
  assumptions: string[];
  uncertainties: string[];
  timeHorizon: Horizon;
  generatedAt: number;
}

export interface ThinkingContext {
  currentState: unknown;
  goals: FutureGoal[];
  knownRisks?: FutureRisk[];
  knownOpportunities?: FutureOpportunity[];
  history?: unknown[];
}

export class LongTermThinking {
  createPlan(context: ThinkingContext): LongTermPlan {
    const risks = context.knownRisks ?? [];
    const opportunities = context.knownOpportunities ?? [];

    const actions: FutureAction[] = context.goals.map((goal, index) => ({
      id: `future-action-${index + 1}`,
      description: `Progress toward: ${goal.title}`,
      expectedOutcome: goal.description ?? goal.title,
      priority: goal.priority,
      reversible: true,
    }));

    const uncertainties = [
      "Future conditions may change.",
      "Predictions depend on available evidence.",
      "Long-term plans must be re-evaluated as new evidence arrives.",
    ];

    return {
      planId: `long-term-plan-${Date.now()}`,
      goals: context.goals,
      risks,
      opportunities,
      actions,
      assumptions: [
        "Current evidence is sufficiently representative for planning.",
        "Goals may change over time.",
      ],
      uncertainties,
      timeHorizon: this.selectHorizon(context.goals),
      generatedAt: Date.now(),
    };
  }

  updatePlan(
    previousPlan: LongTermPlan,
    newContext: ThinkingContext
  ): LongTermPlan {
    const updated = this.createPlan(newContext);

    return {
      ...updated,
      planId: previousPlan.planId,
    };
  }

  private selectHorizon(goals: FutureGoal[]): Horizon {
    if (goals.some((g) => g.horizon === "FUTURE")) return "FUTURE";
    if (goals.some((g) => g.horizon === "LONG_TERM")) return "LONG_TERM";
    if (goals.some((g) => g.horizon === "MEDIUM_TERM")) return "MEDIUM_TERM";
    return "SHORT_TERM";
  }
}
