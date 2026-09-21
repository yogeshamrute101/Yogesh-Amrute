export type RecoveryState = "healthy" | "degraded" | "recovering" | "safe-mode";

export class ResilienceLayer {
  private state: RecoveryState = "healthy";

  fail() {
    this.state = "recovering";
  }

  recover(success = true) {
    this.state = success ? "healthy" : "safe-mode";
    return this.state;
  }

  getState() {
    return this.state;
  }
}
