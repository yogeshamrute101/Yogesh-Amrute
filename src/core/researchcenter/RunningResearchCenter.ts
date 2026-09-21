/**
 * VidoAI Running Research Center
 *
 * Continuous research orchestration:
 * DISCOVER -> COLLECT -> VERIFY -> SYNTHESIZE -> STORE -> UPDATE -> REPORT
 *
 * Research results must distinguish verified facts, evidence, inference,
 * hypothesis, simulation and unknowns.
 */

export type ResearchState =
  | "IDLE"
  | "DISCOVERING"
  | "COLLECTING"
  | "VERIFYING"
  | "SYNTHESIZING"
  | "STORING"
  | "UPDATING"
  | "REPORTING"
  | "PAUSED"
  | "ERROR";

export interface ResearchProject {
  id: string;
  title: string;
  objective: string;
  domain: string;
  state: ResearchState;
  createdAt: number;
  updatedAt: number;
  findings: string[];
  evidence: string[];
  unknowns: string[];
}

export class RunningResearchCenter {
  private projects = new Map<string, ResearchProject>();

  createProject(input: Omit<ResearchProject, "createdAt" | "updatedAt">): ResearchProject {
    const now = Date.now();

    const project: ResearchProject = {
      ...input,
      createdAt: now,
      updatedAt: now
    };

    this.projects.set(project.id, project);
    return project;
  }

  updateProject(id: string, patch: Partial<ResearchProject>): ResearchProject | undefined {
    const current = this.projects.get(id);
    if (!current) return undefined;

    const updated: ResearchProject = {
      ...current,
      ...patch,
      id: current.id,
      createdAt: current.createdAt,
      updatedAt: Date.now()
    };

    this.projects.set(id, updated);
    return updated;
  }

  getProject(id: string): ResearchProject | undefined {
    return this.projects.get(id);
  }

  listProjects(): ResearchProject[] {
    return [...this.projects.values()];
  }

  pause(id: string): void {
    this.updateProject(id, { state: "PAUSED" });
  }

  resume(id: string): void {
    this.updateProject(id, { state: "DISCOVERING" });
  }
}
