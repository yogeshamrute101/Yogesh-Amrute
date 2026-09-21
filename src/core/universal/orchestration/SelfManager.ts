import { universalSystem } from "../UniversalSystem";

export class SelfManager {
  private running = false;

  async process() {
    if (this.running) return;
    this.running = true;

    try {
      let guard = 0;

      while (guard++ < 100) {
        const state = universalSystem.getState();
        const pending = state.tasks.some(
          task =>
            task.status === "queued" ||
            task.status === "planning" ||
            task.status === "running"
        );

        if (!pending) break;

        await universalSystem.runNext();
      }
    } finally {
      this.running = false;
    }
  }
}

export const selfManager = new SelfManager();
