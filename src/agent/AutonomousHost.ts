export type AgentTaskStatus =
  | "queued"
  | "running"
  | "verifying"
  | "recovering"
  | "completed"
  | "blocked"
  | "failed";

export type AgentTask = {
  id: string;
  prompt: string;
  status: AgentTaskStatus;
  result?: unknown;
  error?: string;
  createdAt: string;
  updatedAt: string;
};

export class AutonomousHost {
  private readonly tasks = new Map<string, AgentTask>();

  createTask(prompt: string): AgentTask {
    const now = new Date().toISOString();

    const task: AgentTask = {
      id: crypto.randomUUID(),
      prompt,
      status: "queued",
      createdAt: now,
      updatedAt: now,
    };

    this.tasks.set(task.id, task);
    return task;
  }

  getTask(id: string): AgentTask | undefined {
    return this.tasks.get(id);
  }

  listTasks(): AgentTask[] {
    return [...this.tasks.values()];
  }

  async run(
    id: string,
    executor: (task: AgentTask) => Promise<unknown>,
  ): Promise<AgentTask> {
    const task = this.tasks.get(id);

    if (!task) {
      throw new Error(`Task not found: ${id}`);
    }

    task.status = "running";
    task.updatedAt = new Date().toISOString();

    try {
      const result = await executor(task);
      task.result = result;

      const execution = result as {
        success?: boolean;
        error?: string;
      };

      if (execution && execution.success === false) {
        task.error = execution.error || "Autonomous execution failed.";
        task.status = "failed";
      } else {
        task.status = "completed";
      }
    } catch (error) {
      task.status = "failed";
      task.error =
        error instanceof Error ? error.message : String(error);
    }

    task.updatedAt = new Date().toISOString();
    this.tasks.set(id, task);

    return task;
  }
}

export const autonomousHost = new AutonomousHost();
