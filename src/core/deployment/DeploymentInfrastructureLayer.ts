export type DeploymentEnvironment =
  | "local"
  | "codespaces"
  | "staging"
  | "production"
  | "mobile";

export class DeploymentInfrastructureLayer {
  private environment: DeploymentEnvironment = "local";

  setEnvironment(environment: DeploymentEnvironment) {
    this.environment = environment;
    return environment;
  }

  getEnvironment() {
    return this.environment;
  }
}
