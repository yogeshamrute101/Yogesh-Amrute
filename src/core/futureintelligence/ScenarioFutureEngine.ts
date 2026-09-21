/**
 * Scenario Future Engine
 *
 * Generates multiple possible futures instead of a single deterministic future.
 */

export type FutureType =
  | "BASELINE"
  | "OPTIMISTIC"
  | "PESSIMISTIC"
  | "DISRUPTION"
  | "RECOVERY"
  | "UNKNOWN";

export interface FutureScenario {
  id: string;
  type: FutureType;
  description: string;
  assumptions: string[];
  estimatedProbability?: number;
  uncertainty: number;
}

export class ScenarioFutureEngine {
  generate(
    domain: string,
    conditions: Record<string, unknown>
  ): FutureScenario[] {
    return [
      {
        id: `${domain}-baseline`,
        type: "BASELINE",
        description: "Continuation under broadly similar conditions.",
        assumptions: ["No major regime change"],
        uncertainty: 0.35
      },
      {
        id: `${domain}-optimistic`,
        type: "OPTIMISTIC",
        description: "Favorable conditions and positive feedback dominate.",
        assumptions: ["Favorable drivers persist"],
        uncertainty: 0.55
      },
      {
        id: `${domain}-pessimistic`,
        type: "PESSIMISTIC",
        description: "Negative drivers become stronger.",
        assumptions: ["Adverse drivers persist"],
        uncertainty: 0.65
      },
      {
        id: `${domain}-disruption`,
        type: "DISRUPTION",
        description: "A significant unexpected change alters the trajectory.",
        assumptions: ["Low-frequency event occurs"],
        uncertainty: 0.9
      },
      {
        id: `${domain}-unknown`,
        type: "UNKNOWN",
        description: "Outcome cannot currently be modeled reliably.",
        assumptions: ["Insufficient evidence"],
        uncertainty: 1
      }
    ];
  }
}
