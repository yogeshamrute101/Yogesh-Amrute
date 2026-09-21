/**
 * Checkpoint Manager
 *
 * Keeps recovery checkpoints in memory at the architecture level.
 * Production persistence should use a durable storage adapter.
 */

import type { SystemCheckpoint } from "./SurvivalOrchestrator";

export class CheckpointManager {
  private latest?: SystemCheckpoint;

  create(state: unknown, version = "unknown"): SystemCheckpoint {
    const checkpoint: SystemCheckpoint = {
      id: `checkpoint-${Date.now()}`,
      timestamp: Date.now(),
      version,
      state
    };

    this.latest = checkpoint;
    return checkpoint;
  }

  latestCheckpoint(): SystemCheckpoint | undefined {
    return this.latest;
  }

  clear(): void {
    this.latest = undefined;
  }
}
