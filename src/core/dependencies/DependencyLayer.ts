export type Dependency = {
  name: string;
  version?: string;
  source: "npm" | "api" | "plugin" | "service" | "internal";
  healthy: boolean;
};

export class DependencyLayer {
  check(dependencies: Dependency[]) {
    return dependencies.map(dep => ({
      ...dep,
      status: dep.healthy ? "healthy" : "attention-required"
    }));
  }
}
