/**
 * Degraded operation controller.
 *
 * Removes optional workload when resources/dependencies are unavailable.
 */

export type DegradedLevel =
  | "NORMAL"
  | "LIMITED"
  | "OFFLINE"
  | "SAFE";

export class DegradedModeController {
  private level: DegradedLevel = "NORMAL";

  set(level: DegradedLevel): void {
    this.level = level;
  }

  get(): DegradedLevel {
    return this.level;
  }

  allowsOptionalWork(): boolean {
    return this.level === "NORMAL";
  }

  allowsCoreRecovery(): boolean {
    return true;
  }
}
