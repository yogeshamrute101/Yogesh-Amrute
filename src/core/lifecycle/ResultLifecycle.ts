export type LifecycleStage =
  | "START"
  | "UNDERSTAND"
  | "PLAN"
  | "GUIDE"
  | "EXECUTE"
  | "MONITOR"
  | "VERIFY"
  | "PRODUCE_RESULT"
  | "REPORT"
  | "CLOSE"
  | "LEARN";

export interface LifecycleRun {
  id: string;
  purpose: string;
  startedAt: string;
  endedAt?: string;
  stage: LifecycleStage;
  result?: unknown;
  verified: boolean;
  status: "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED";
}

export class ResultLifecycle {
  private runs = new Map<string, LifecycleRun>();

  start(id: string, purpose: string): LifecycleRun {
    const run: LifecycleRun = {
      id, purpose,
      startedAt: new Date().toISOString(),
      stage: "START",
      verified: false,
      status: "RUNNING",
    };
    this.runs.set(id, run);
    return run;
  }

  advance(id: string, stage: LifecycleStage) {
    const run = this.require(id);
    run.stage = stage;
    return run;
  }

  produceResult(id: string, result: unknown, verified = false) {
    const run = this.require(id);
    run.result = result;
    run.verified = verified;
    run.stage = "PRODUCE_RESULT";
    return run;
  }

  close(id: string) {
    const run = this.require(id);
    run.stage = "CLOSE";
    run.status = "COMPLETED";
    run.endedAt = new Date().toISOString();
    return run;
  }

  get(id: string) {
    return this.runs.get(id);
  }

  private require(id: string) {
    const run = this.runs.get(id);
    if (!run) throw new Error(`Lifecycle run not found: ${id}`);
    return run;
  }
}
