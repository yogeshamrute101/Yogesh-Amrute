export type AutonomousTaskStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed";

export interface AutonomousTask {
  id: string;
  goal: string;
  status: AutonomousTaskStatus;
  createdAt: string;
  updatedAt: string;
  result?: unknown;
  error?: string;
}

export interface AutonomousExecutor {
  execute(task: AutonomousTask): Promise<unknown>;
}

export class AutonomousTaskService {
  private readonly tasks = new Map<string, AutonomousTask>();

  constructor(private readonly executor?: AutonomousExecutor) {}

  create(goal: string): AutonomousTask {
    const normalizedGoal = goal.trim();

    if (!normalizedGoal) {
      throw new Error("A goal is required");
    }

    const now = new Date().toISOString();

    const task: AutonomousTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      goal: normalizedGoal,
      status: "queued",
      createdAt: now,
      updatedAt: now,
    };

    this.tasks.set(task.id, task);
    return task;
  }

  get(id: string): AutonomousTask | undefined {
    return this.tasks.get(id);
  }

  async execute(id: string): Promise<AutonomousTask> {
    const task = this.tasks.get(id);

    if (!task) {
      throw new Error("Autonomous task not found");
    }

    if (!this.executor) {
      task.status = "failed";
      task.error = "Autonomous execution adapter is not configured";
      task.updatedAt = new Date().toISOString();
      return task;
    }

    task.status = "processing";
    task.updatedAt = new Date().toISOString();

    try {
      task.result = await this.executor.execute(task);
      task.status = "completed";
      task.updatedAt = new Date().toISOString();
      return task;
    } catch (error: any) {
      task.status = "failed";
      task.error = error?.message || "Autonomous execution failed";
      task.updatedAt = new Date().toISOString();
      return task;
    }
  }
}
