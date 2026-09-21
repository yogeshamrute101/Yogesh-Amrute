export type TaskStatus =
  | "QUEUED"
  | "RUNNING"
  | "WAITING"
  | "BLOCKED"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export interface MultiTask {
  id: string;
  name: string;
  priority?: number;
  dependencies?: string[];
  resources?: string[];
  status?: TaskStatus;
  action: () => Promise<unknown> | unknown;
}

export interface TaskResult {
  id: string;
  status: TaskStatus;
  result?: unknown;
  error?: string;
}

export interface MultiTaskReport {
  startedAt: string;
  finishedAt: string;
  results: TaskResult[];
}

export class MultiTaskingEngine {
  private activeResources = new Set<string>();
  private completed = new Set<string>();

  async run(
    tasks: MultiTask[],
    maxParallel = 4
  ): Promise<MultiTaskReport> {
    const startedAt = new Date().toISOString();
    const pending = [...tasks].sort(
      (a, b) => (b.priority ?? 0) - (a.priority ?? 0)
    );
    const results: TaskResult[] = [];

    while (pending.length > 0) {
      const ready = pending.filter((task) => {
        const dependenciesReady = (task.dependencies ?? []).every((id) =>
          this.completed.has(id)
        );

        const resourcesFree = (task.resources ?? []).every(
          (resource) => !this.activeResources.has(resource)
        );

        return dependenciesReady && resourcesFree;
      });

      if (ready.length === 0) {
        for (const task of pending) {
          results.push({
            id: task.id,
            status: "BLOCKED",
            error: "Dependencies or resources are unavailable.",
          });
        }
        break;
      }

      const batch = ready.slice(0, maxParallel);

      batch.forEach((task) => {
        const index = pending.findIndex((item) => item.id === task.id);
        if (index >= 0) pending.splice(index, 1);

        (task.resources ?? []).forEach((resource) =>
          this.activeResources.add(resource)
        );
      });

      const batchResults = await Promise.all(
        batch.map(async (task): Promise<TaskResult> => {
          try {
            const result = await task.action();

            this.completed.add(task.id);

            return {
              id: task.id,
              status: "COMPLETED",
              result,
            };
          } catch (error) {
            return {
              id: task.id,
              status: "FAILED",
              error: error instanceof Error ? error.message : String(error),
            };
          } finally {
            (task.resources ?? []).forEach((resource) =>
              this.activeResources.delete(resource)
            );
          }
        })
      );

      results.push(...batchResults);
    }

    return {
      startedAt,
      finishedAt: new Date().toISOString(),
      results,
    };
  }
}
