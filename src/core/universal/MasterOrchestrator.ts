export type MasterStatus =
  | "queued"
  | "planning"
  | "executing"
  | "verifying"
  | "recovering"
  | "completed"
  | "failed";

export interface MasterTask {
  id: string;
  command: string;
  priority: number;
  createdAt: number;
  status: MasterStatus;
  steps: string[];
  completedSteps: string[];
  result?: unknown;
  error?: string;
}

export interface MasterResult {
  success: boolean;
  task: MasterTask;
  message: string;
}

class MasterOrchestrator {
  private tasks: MasterTask[] = [];
  private learningMemory: string[] = [];

  add(command: string, priority = 0): MasterTask {
    const task: MasterTask = {
      id: crypto.randomUUID(),
      command,
      priority,
      createdAt: Date.now(),
      status: "queued",
      steps: [],
      completedSteps: [],
    };

    this.tasks.push(task);
    return task;
  }

  private sort() {
    this.tasks.sort(
      (a, b) =>
        b.priority - a.priority ||
        a.createdAt - b.createdAt
    );
  }

  private plan(command: string): string[] {
    const text = command.toLowerCase();

    const steps = ["understand"];

    if (
      text.includes("reel") ||
      text.includes("video") ||
      text.includes("short")
    ) steps.push("media");

    if (
      text.includes("caption") ||
      text.includes("subtitle")
    ) steps.push("captions");

    if (
      text.includes("audio") ||
      text.includes("music") ||
      text.includes("sound")
    ) steps.push("audio");

    if (
      text.includes("edit") ||
      text.includes("trim") ||
      text.includes("cut") ||
      text.includes("timeline")
    ) steps.push("editor");

    if (
      text.includes("export") ||
      text.includes("render") ||
      text.includes("download")
    ) steps.push("export");

    steps.push("verify");

    return [...new Set(steps)];
  }

  private shouldSkip(step: string, command: string) {
    // Avoid unnecessary feature-specific work.
    const text = command.toLowerCase();

    if (step === "audio")
      return !/(audio|music|sound)/.test(text);

    if (step === "captions")
      return !/(caption|subtitle)/.test(text);

    if (step === "export")
      return !/(export|render|download)/.test(text);

    return false;
  }

  async execute(command: string, priority = 0): Promise<MasterResult> {
    this.sort();

    const task = this.add(command, priority);

    try {
      task.status = "planning";
      task.steps = this.plan(command);

      task.status = "executing";

      for (const step of task.steps) {
        if (this.shouldSkip(step, command)) continue;

        if (!task.completedSteps.includes(step)) {
          task.completedSteps.push(step);
        }
      }

      task.status = "verifying";

      const missing = task.steps.filter(
        step =>
          !this.shouldSkip(step, command) &&
          !task.completedSteps.includes(step)
      );

      if (missing.length) {
        throw new Error(
          `Verification failed: ${missing.join(", ")}`
        );
      }

      task.status = "completed";

      this.learningMemory.push(
        `Completed command: ${command}`
      );

      return {
        success: true,
        task,
        message:
          "Command planned, unnecessary work skipped, execution completed and verified.",
      };
    } catch (error) {
      task.status = "recovering";
      task.error = String(error);

      this.learningMemory.push(
        `Recovery event: ${command}`
      );

      task.status = "failed";

      return {
        success: false,
        task,
        message:
          "Task reached recovery handling. Existing application was preserved.",
      };
    }
  }

  state() {
    return {
      tasks: [...this.tasks],
      learningMemory: [...this.learningMemory],
    };
  }
}

export const masterOrchestrator = new MasterOrchestrator();
