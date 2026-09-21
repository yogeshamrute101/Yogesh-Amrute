export interface PlanningGoal {
  id: string;
  description: string;
  priority: number;
  deadline?: number;
}

export interface PlanningStep {
  id: string;
  action: string;
  reason: string;
  dependencies: string[];
  expectedOutcome: string;
  reversible: boolean;
}

export interface AdvancedPlan {
  planId: string;
  objective: string;
  goals: PlanningGoal[];
  steps: PlanningStep[];
  contingencies: string[];
  checkpoints: string[];
  assumptions: string[];
  uncertainties: string[];
  createdAt: number;
}

export interface PlanningContext {
  objective: string;
  goals: PlanningGoal[];
  constraints?: string[];
  projections?: unknown[];
}

export class AdvancedPlanner {
  plan(context: PlanningContext): AdvancedPlan {
    const sortedGoals = [...context.goals].sort(
      (a, b) => b.priority - a.priority
    );

    const steps: PlanningStep[] = sortedGoals.map((goal, index) => ({
      id: `step-${index + 1}`,
      action: `Work toward: ${goal.description}`,
      reason: `Supports objective: ${context.objective}`,
      dependencies:
        index === 0 ? [] : [`step-${index}`],
      expectedOutcome: `Measurable progress toward ${goal.description}`,
      reversible: true,
    }));

    return {
      planId: `advanced-plan-${Date.now()}`,
      objective: context.objective,
      goals: sortedGoals,
      steps,
      contingencies: [
        "If evidence changes, recalculate the plan.",
        "If risk increases, reduce or pause the affected action.",
        "If a dependency fails, select an alternative route.",
      ],
      checkpoints: [
        "Before major action",
        "After major action",
        "When new evidence appears",
        "When risk changes materially",
      ],
      assumptions: [
        "Available evidence is sufficiently representative.",
        "Goals remain valid until reviewed.",
      ],
      uncertainties: [
        "Future conditions cannot be guaranteed.",
        "Projection confidence decreases with time horizon.",
      ],
      createdAt: Date.now(),
    };
  }
}
