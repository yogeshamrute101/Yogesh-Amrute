export type SystemContext = {
  userId?: string;
  projectId?: string;
  sessionId?: string;
  environment?: "development" | "testing" | "production";
};

export class IdentityContextLayer {
  private context: SystemContext = {};

  set(context: SystemContext) {
    this.context = { ...this.context, ...context };
    return this.context;
  }

  get() {
    return { ...this.context };
  }

  clear() {
    this.context = {};
  }
}
