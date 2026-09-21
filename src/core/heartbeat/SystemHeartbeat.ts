export type Heartbeat = {
  timestamp: number;
  cycle: number;
  healthy: boolean;
};

export class SystemHeartbeat {
  private latest?: Heartbeat;

  pulse(cycle: number, healthy = true) {
    this.latest = {
      timestamp: Date.now(),
      cycle,
      healthy
    };

    return this.latest;
  }

  getLatest() {
    return this.latest;
  }

  isAlive(maxAgeMs = 10000) {
    return !!this.latest &&
      Date.now() - this.latest.timestamp <= maxAgeMs;
  }
}
