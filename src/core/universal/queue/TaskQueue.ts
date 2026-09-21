import type { UniversalTask, Priority } from "../types/SystemTypes";

const weight: Record<Priority, number> = {
  critical: 4,
  high: 3,
  normal: 2,
  low: 1,
};

export class TaskQueue {
  private tasks: UniversalTask[] = [];

  add(task: UniversalTask) {
    this.tasks.push(task);
    this.sort();
  }

  addMany(tasks: UniversalTask[]) {
    this.tasks.push(...tasks);
    this.sort();
  }

  private sort() {
    this.tasks.sort(
      (a, b) =>
        weight[b.priority] - weight[a.priority] ||
        a.createdAt - b.createdAt
    );
  }

  next(): UniversalTask | undefined {
    return this.tasks.find(
      (task) => task.status === "queued"
    );
  }

  remove(id: string) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  all() {
    return [...this.tasks];
  }

  clear() {
    this.tasks = [];
  }
}
