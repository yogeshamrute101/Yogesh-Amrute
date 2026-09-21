export type SystemState =
  | "STARTING"
  | "RUNNING"
  | "DEGRADED"
  | "RECOVERING"
  | "SAFE_MODE"
  | "STOPPED";

export interface SystemHealth {
  state: SystemState;
  lastHeartbeat: number;
  restartCount: number;
  completedTasks: number;
  failedTasks: number;
  uptimeMs: number;
}

export class AlwaysOnSystem {
  private state: SystemState = "STARTING";
  private startedAt = Date.now();
  private lastHeartbeat = Date.now();
  private restartCount = 0;
  private completedTasks = 0;
  private failedTasks = 0;
  private heartbeatTimer?: ReturnType<typeof setInterval>;

  start(heartbeatMs = 5000): void {
    if (this.heartbeatTimer) return;

    this.state = "RUNNING";
    this.lastHeartbeat = Date.now();

    this.heartbeatTimer = setInterval(() => {
      this.heartbeat();
    }, heartbeatMs);
  }

  heartbeat(): void {
    this.lastHeartbeat = Date.now();

    if (this.state !== "SAFE_MODE") {
      this.state = "RUNNING";
    }
  }

  markTaskCompleted(): void {
    this.completedTasks++;
    this.heartbeat();
  }

  markTaskFailed(): void {
    this.failedTasks++;
    this.heartbeat();
  }

  async recover(reason: string): Promise<void> {
    this.state = "RECOVERING";
    this.restartCount++;

    // Recovery hook for future integrations:
    // task queue, persistence, service restart, network reconnect, etc.
    void reason;

    await Promise.resolve();
    this.lastHeartbeat = Date.now();
    this.state = "RUNNING";
  }

  enterSafeMode(): void {
    this.state = "SAFE_MODE";
  }

  stop(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = undefined;
    }

    this.state = "STOPPED";
  }

  health(): SystemHealth {
    return {
      state: this.state,
      lastHeartbeat: this.lastHeartbeat,
      restartCount: this.restartCount,
      completedTasks: this.completedTasks,
      failedTasks: this.failedTasks,
      uptimeMs: Date.now() - this.startedAt,
    };
  }
}
