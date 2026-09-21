import { Experience } from "../types";

export class ExperienceEngine {
  private memory: Experience[] = [];

  learn(experience: Omit<Experience, "id" | "createdAt">) {
    const item: Experience = {
      ...experience,
      id: `exp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: Date.now(),
    };

    this.memory.push(item);
    return item;
  }

  findRelevant(task: string) {
    const words = task.toLowerCase().split(/\s+/);

    return this.memory
      .map((item) => ({
        item,
        score: words.filter((w) =>
          item.task.toLowerCase().includes(w)
        ).length,
      }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.item);
  }

  all() {
    return [...this.memory];
  }
}
