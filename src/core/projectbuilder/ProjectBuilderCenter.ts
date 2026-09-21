/**
 * VidoAI Running Project Builder Center
 *
 * Project lifecycle:
 * DISCOVER -> REQUIREMENTS -> ARCHITECTURE -> BUILD -> TEST
 * -> VERIFY -> DEPLOY -> MONITOR -> IMPROVE
 *
 * Actual execution must use authorized tools/adapters.
 */

export type ProjectBuildState =
  | "NEW"
  | "DISCOVERY"
  | "REQUIREMENTS"
  | "ARCHITECTURE"
  | "BUILDING"
  | "TESTING"
  | "VERIFYING"
  | "READY"
  | "DEPLOYING"
  | "RUNNING"
  | "FAILED"
  | "PAUSED";

export interface BuildTask {
  id: string;
  title: string;
  command?: string;
  dependencies: string[];
  completed: boolean;
}

export interface ManagedProject {
  id: string;
  name: string;
  objective: string;
  state: ProjectBuildState;
  tasks: BuildTask[];
  createdAt: number;
  updatedAt: number;
}

export class ProjectBuilderCenter {
  private projects = new Map<string, ManagedProject>();

  createProject(input: Omit<ManagedProject, "createdAt" | "updatedAt">): ManagedProject {
    const now = Date.now();

    const project: ManagedProject = {
      ...input,
      createdAt: now,
      updatedAt: now
    };

    this.projects.set(project.id, project);
    return project;
  }

  updateState(id: string, state: ProjectBuildState): ManagedProject | undefined {
    const project = this.projects.get(id);
    if (!project) return undefined;

    project.state = state;
    project.updatedAt = Date.now();
    this.projects.set(id, project);

    return project;
  }

  addTask(id: string, task: BuildTask): ManagedProject | undefined {
    const project = this.projects.get(id);
    if (!project) return undefined;

    project.tasks.push(task);
    project.updatedAt = Date.now();
    this.projects.set(id, project);

    return project;
  }

  listProjects(): ManagedProject[] {
    return [...this.projects.values()];
  }
}
