export type ProjectStatus =
  | "QUEUED"
  | "PLANNING"
  | "RUNNING"
  | "PAUSED"
  | "COMPLETED"
  | "FAILED"
  | "RECOVERING";

export type ProjectPriority =
  | "CRITICAL"
  | "HIGH"
  | "NORMAL"
  | "BACKGROUND";

export interface ProjectTask {
  id: string;
  projectId: string;
  name: string;
  dependencies?: string[];
  estimatedCost?: number;
  completed?: boolean;
}

export interface Project {
  id: string;
  name: string;
  createdAt: number;
  priority: ProjectPriority;
  status: ProjectStatus;
  tasks: ProjectTask[];
  resourceBudget?: {
    cpu?: number;
    memory?: number;
    storage?: number;
    network?: number;
    gpu?: number;
  };
  metadata?: Record<string, unknown>;
}

export interface ProjectExecutionState {
  projectId: string;
  completedTasks: string[];
  activeTasks: string[];
  failedTasks: string[];
  checkpoint?: unknown;
}

const priorityRank: Record<ProjectPriority, number> = {
  CRITICAL: 0,
  HIGH: 1,
  NORMAL: 2,
  BACKGROUND: 3,
};

export class MultiProjectOrchestrator {
  private projects = new Map<string, Project>();
  private states = new Map<string, ProjectExecutionState>();

  register(project: Project) {
    if (!this.projects.has(project.id)) {
      this.projects.set(project.id, { ...project });
      this.states.set(project.id, {
        projectId: project.id,
        completedTasks: [],
        activeTasks: [],
        failedTasks: [],
      });
    }

    return this.projects.get(project.id);
  }

  get(projectId: string) {
    return this.projects.get(projectId);
  }

  list() {
    return [...this.projects.values()];
  }

  schedule() {
    return [...this.projects.values()]
      .filter(
        project =>
          project.status !== "COMPLETED" &&
          project.status !== "FAILED"
      )
      .sort((a, b) => {
        const priority =
          priorityRank[a.priority] - priorityRank[b.priority];

        if (priority !== 0) return priority;

        return a.createdAt - b.createdAt;
      });
  }

  runnableTasks(projectId: string) {
    const project = this.projects.get(projectId);
    const state = this.states.get(projectId);

    if (!project || !state) return [];

    const completed = new Set(state.completedTasks);

    return project.tasks.filter(task => {
      if (completed.has(task.id)) return false;

      return (task.dependencies ?? []).every(
        dependency => completed.has(dependency)
      );
    });
  }

  updateState(
    projectId: string,
    patch: Partial<ProjectExecutionState>
  ) {
    const current = this.states.get(projectId);

    if (!current) return undefined;

    const updated = {
      ...current,
      ...patch,
    };

    this.states.set(projectId, updated);
    return updated;
  }

  complete(projectId: string) {
    const project = this.projects.get(projectId);

    if (!project) return;

    project.status = "COMPLETED";
    this.projects.set(projectId, project);
  }

  fail(projectId: string) {
    const project = this.projects.get(projectId);

    if (!project) return;

    project.status = "FAILED";
    this.projects.set(projectId, project);
  }

  activeCount() {
    return [...this.projects.values()].filter(
      project => project.status === "RUNNING"
    ).length;
  }
}
