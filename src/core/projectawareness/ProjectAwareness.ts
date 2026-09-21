export type ProjectState = {
  root?: string;
  branch?: string;
  files: number;
  modules: string[];
  knownErrors: string[];
  warnings: string[];
  lastChecks: {
    lint?: "passed" | "failed" | "unknown";
    build?: "passed" | "failed" | "unknown";
    tests?: "passed" | "failed" | "unknown";
  };
  updatedAt: number;
};

export class ProjectAwareness {
  private state: ProjectState = {
    files: 0,
    modules: [],
    knownErrors: [],
    warnings: [],
    lastChecks: {},
    updatedAt: Date.now()
  };

  update(partial: Partial<ProjectState>) {
    this.state = {
      ...this.state,
      ...partial,
      updatedAt: Date.now()
    };
    return this.state;
  }

  getState() {
    return structuredClone(this.state);
  }

  addError(error: string) {
    if (!this.state.knownErrors.includes(error)) {
      this.state.knownErrors.push(error);
    }
    this.state.updatedAt = Date.now();
  }

  clearError(error: string) {
    this.state.knownErrors =
      this.state.knownErrors.filter(x => x !== error);
    this.state.updatedAt = Date.now();
  }
}
