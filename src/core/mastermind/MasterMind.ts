import { ActivityPipeline } from "../activity/ActivityPipeline";
import { DecisionEngine, DecisionResult } from "../decision/DecisionEngine";
import { LongTermThinking, LongTermPlan, ThinkingContext } from "../longterm/LongTermThinking";
import { PerceptionInput } from "../perception/MultimodalPerception";

export interface MasterMindInput {
  perception?: PerceptionInput[];
  thinking?: ThinkingContext;
  objective?: string;
}

export interface MasterMindResult {
  cycleId: string;
  objective?: string;
  activity?: ReturnType<ActivityPipeline["process"]>;
  decision?: DecisionResult;
  longTermPlan?: LongTermPlan;
  nextSteps: string[];
  status: "READY" | "UNCERTAIN" | "REVIEW";
  timestamp: number;
}

export class MasterMind {
  private activity = new ActivityPipeline();
  private decision = new DecisionEngine();
  private longTerm = new LongTermThinking();

  run(input: MasterMindInput): MasterMindResult {
    let activityResult;
    let decisionResult;
    let longTermPlan;

    if (input.perception && input.perception.length > 0) {
      activityResult = this.activity.process(input.perception);

      decisionResult = this.decision.decide({
        goal: input.objective,
        evidence: activityResult.evidence.sourceInputIds.map((id) => ({
          source: id,
          observation: activityResult.evidence.observations.join("; "),
          confidence: activityResult.confidence,
        })),
      });
    }

    if (input.thinking) {
      longTermPlan = this.longTerm.createPlan(input.thinking);
    }

    const status =
      decisionResult?.classification === "UNCERTAIN" ||
      decisionResult?.classification === "NEEDS_REVIEW"
        ? "REVIEW"
        : "READY";

    return {
      cycleId: `mastermind-${Date.now()}`,
      objective: input.objective,
      activity: activityResult,
      decision: decisionResult,
      longTermPlan,
      nextSteps: this.generateNextSteps(decisionResult, longTermPlan),
      status,
      timestamp: Date.now(),
    };
  }

  private generateNextSteps(
    decision?: DecisionResult,
    plan?: LongTermPlan
  ): string[] {
    const steps: string[] = [];

    if (decision?.requiresHumanApproval) {
      steps.push("Request human approval before high-impact action.");
    }

    if (decision) {
      steps.push(`Verify decision: ${decision.classification}.`);
    }

    if (plan) {
      steps.push(...plan.actions.slice(0, 3).map((a) => a.description));
    }

    if (steps.length === 0) {
      steps.push("Collect evidence and continue system observation.");
    }

    return steps;
  }
}
