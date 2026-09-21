export type TaskStatus =
  | "queued"
  | "planning"
  | "running"
  | "waiting"
  | "completed"
  | "failed"
  | "recovered";

export interface UniversalTask {
  id: string;
  title: string;
  description: string;
  priority: number;
  createdAt: number;
  status: TaskStatus;
  steps: string[];
  completedSteps: string[];
  result?: unknown;
  error?: string;
}

export interface SystemDecision {
  action: string;
  reason: string;
  confidence: number;
}

export interface SystemState {
  tasks: UniversalTask[];
  activeTaskId?: string;
  completedCount: number;
  failedCount: number;
  recoveredCount: number;
  learnedRules: string[];
}

export class UniversalSystem {
  private state: SystemState = {
    tasks: [],
    completedCount: 0,
    failedCount: 0,
    recoveredCount: 0,
    learnedRules: [],
  };

  addTask(title: string, description = "", priority = 0) {
    const task: UniversalTask = {
      id: crypto.randomUUID(),
      title,
      description,
      priority,
      createdAt: Date.now(),
      status: "queued",
      steps: [],
      completedSteps: [],
    };

    this.state.tasks.push(task);
    return task;
  }

  prioritize() {
    this.state.tasks.sort(
      (a, b) =>
        b.priority - a.priority ||
        a.createdAt - b.createdAt
    );
  }

  plan(task: UniversalTask): string[] {
    task.status = "planning";

    const description = `${task.title} ${task.description}`.toLowerCase();

    if (description.includes("reel"))
      return ["understand request", "prepare media", "generate reel", "verify result"];

    if (description.includes("caption"))
      return ["read media", "generate captions", "verify captions", "apply captions"];

    if (description.includes("audio"))
      return ["inspect audio", "process audio", "verify audio", "apply audio"];

    if (description.includes("export"))
      return ["validate project", "prepare export", "export media", "verify export"];

    return [
      "understand request",
      "inspect available resources",
      "choose practical solution",
      "execute",
      "verify result",
    ];
  }

  chooseBestAction(task: UniversalTask): SystemDecision {
    const remaining = task.steps.filter(
      step => !task.completedSteps.includes(step)
    );

    return {
      action: remaining[0] || "verify result",
      reason: "Choose the next unfinished step while avoiding unnecessary work.",
      confidence: remaining.length ? 0.8 : 0.95,
    };
  }

  executeStep(task: UniversalTask, step: string) {
    task.status = "running";

    // Safe orchestration layer:
    // Real feature-specific services remain responsible for actual work.
    if (!task.completedSteps.includes(step)) {
      task.completedSteps.push(step);
    }

    return true;
  }

  verify(task: UniversalTask) {
    const complete =
      task.steps.length > 0 &&
      task.steps.every(step => task.completedSteps.includes(step));

    if (complete) {
      task.status = "completed";
      this.state.completedCount++;
      return true;
    }

    return false;
  }

  recover(task: UniversalTask, error: unknown) {
    task.error = String(error);
    task.status = "recovered";
    this.state.recoveredCount++;

    this.state.learnedRules.push(
      `Recovery applied for task: ${task.title}`
    );
  }

  async runNext() {
    this.prioritize();

    const task = this.state.tasks.find(
      t => t.status === "queued" || t.status === "planning" || t.status === "running"
    );

    if (!task) return null;

    try {
      if (!task.steps.length)
        task.steps = this.plan(task);

      while (task.completedSteps.length < task.steps.length) {
        const decision = this.chooseBestAction(task);

        if (decision.action === "verify result")
          break;

        this.executeStep(task, decision.action);
      }

      this.verify(task);
      return task;
    } catch (error) {
      this.state.failedCount++;
      this.recover(task, error);
      return task;
    }
  }

  getState() {
    return structuredClone(this.state);
  }
}

export const universalSystem = new UniversalSystem();
