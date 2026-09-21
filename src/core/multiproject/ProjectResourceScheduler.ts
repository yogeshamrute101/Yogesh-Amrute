import {
  Project,
  ProjectTask,
} from "./MultiProjectOrchestrator";

export interface AvailableResources {
  cpu: number;
  memory: number;
  storage: number;
  network: number;
  gpu: number;
}

export class ProjectResourceScheduler {
  selectProjects(
    projects: Project[],
    resources: AvailableResources,
    maxParallel = 4
  ) {
    const candidates = projects.filter(
      project =>
        project.status !== "COMPLETED" &&
        project.status !== "FAILED"
    );

    const selected: Project[] = [];

    for (const project of candidates) {
      if (selected.length >= maxParallel) break;

      const budget = project.resourceBudget ?? {};

      if (
        (budget.cpu ?? 0) <= resources.cpu &&
        (budget.memory ?? 0) <= resources.memory &&
        (budget.storage ?? 0) <= resources.storage &&
        (budget.network ?? 0) <= resources.network &&
        (budget.gpu ?? 0) <= resources.gpu
      ) {
        selected.push(project);
      }
    }

    return selected;
  }

  selectTasks(
    tasks: ProjectTask[],
    maxTasks = 16
  ) {
    return tasks
      .filter(task => !task.completed)
      .slice(0, maxTasks);
  }
}
