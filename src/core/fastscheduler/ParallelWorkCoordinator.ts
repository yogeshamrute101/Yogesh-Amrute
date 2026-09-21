export interface ParallelTask {
  id: string;
  dependencies?: string[];
  execute: () => Promise<unknown>;
}

export class ParallelWorkCoordinator {
  async execute(tasks: ParallelTask[]) {
    const independent = tasks.filter(
      task => !(task.dependencies?.length)
    );

    const dependent = tasks.filter(
      task => Boolean(task.dependencies?.length)
    );

    const parallelResults = await Promise.all(
      independent.map(task => task.execute())
    );

    const sequentialResults: unknown[] = [];

    for (const task of dependent) {
      sequentialResults.push(await task.execute());
    }

    return {
      parallelResults,
      sequentialResults,
    };
  }
}
