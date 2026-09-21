export type ImprovementStage =
  | "DETECT"
  | "DIAGNOSE"
  | "PLAN"
  | "CORRECT"
  | "PREVENT"
  | "TEST"
  | "VERIFY"
  | "LEARN"
  | "MONITOR";

export type ImprovementCycle = {
  id: string;
  problem: string;
  stage: ImprovementStage;
  evidence: string[];
  result?: string;
};

export class ClosedLoopImprovement {
  private cycles = new Map<string, ImprovementCycle>();

  start(cycle: ImprovementCycle) {
    this.cycles.set(cycle.id, cycle);
    return cycle;
  }

  advance(id: string, stage: ImprovementStage, result?: string) {
    const cycle = this.cycles.get(id);
    if (!cycle) return undefined;

    cycle.stage = stage;
    if (result !== undefined) cycle.result = result;

    return cycle;
  }

  list() {
    return [...this.cycles.values()];
  }
}
