import { Project } from "./MultiProjectOrchestrator";

export interface ProjectIsolationContext {
  projectId: string;
  namespace: string;
  dataBoundary: string;
  resourceBoundary: string;
}

export class ProjectIsolation {
  create(project: Project): ProjectIsolationContext {
    return {
      projectId: project.id,
      namespace: `project:${project.id}`,
      dataBoundary: `data:${project.id}`,
      resourceBoundary: `resources:${project.id}`,
    };
  }
}
