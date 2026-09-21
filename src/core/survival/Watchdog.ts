/**
 * Lightweight watchdog contract.
 *
 * It detects missed heartbeats; an external supervisor is still required
 * for guaranteed process restart.
 */

export class Watchdog {
  private lastHeartbeat = Date.now();

  heartbeat(): void {
    this.lastHeartbeat = Date.now();
  }

  ageMs(): number {
    return Date.now() - this.lastHeartbeat;
  }

  healthy(timeoutMs: number): boolean {
    return this.ageMs() <= timeoutMs;
  }
}
