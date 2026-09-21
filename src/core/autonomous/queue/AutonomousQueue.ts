import { AutonomousTask } from "../types";

export class AutonomousQueue {
  private tasks: AutonomousTask[] = [];

  add(tasks: AutonomousTask | AutonomousTask[]) {
    this.tasks.push(...(Array.isArray(tasks) ? tasks : [tasks]));
  }

  next(): AutonomousTask | undefined {
    const available = this.tasks
      .filter((t) => t.status === "queued")
      .sort(
        (a, b) =>
          b.priority - a.priority ||
          a.createdAt - b.createdAt
      );

    return available[0];
  }

  update(id: string, patch: Partial<AutonomousTask>) {
    const task = this.tasks.find((t) => t.id === id);
    if (task) Object.assign(task, patch);
  }

  all() {
    return [...this.tasks];
  }

  pending() {
    return this.tasks.filter((t) => t.status === "queued");
  }

  clearCompleted() {
    this.tasks = this.tasks.filter(
      (t) => t.status !== "completed"
    );
  }
}
