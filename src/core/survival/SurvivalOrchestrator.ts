/**
 * VidoAI Resilience / Survival Orchestrator
 *
 * Goal: maximize availability and recoverability under failures.
 * It never bypasses security, authorization or safety controls.
 */

export type FailureType =
  | "CRASH"
  | "PROCESS_EXIT"
  | "NETWORK_LOSS"
  | "AI_PROVIDER_FAILURE"
  | "STORAGE_FAILURE"
  | "CORRUPTED_STATE"
  | "RESOURCE_EXHAUSTION"
  | "DEPENDENCY_FAILURE"
  | "DEVICE_OFFLINE"
  | "UNKNOWN";

export type RecoveryAction =
  | "CHECKPOINT"
  | "SAVE_STATE"
  | "ISOLATE"
  | "RETRY"
  | "BACKOFF"
  | "FAILOVER"
  | "RESTORE"
  | "ROLLBACK"
  | "RESTART"
  | "SAFE_MODE"
  | "DEGRADED_MODE"
  | "REQUEST_HUMAN_REVIEW"
  | "STOP";

export interface SystemCheckpoint {
  id: string;
  timestamp: number;
  version: string;
  state: unknown;
  checksum?: string;
}

export interface FailureEvent {
  id: string;
  type: FailureType;
  timestamp: number;
  component: string;
  message: string;
  recoverable: boolean;
}

export interface RecoveryResult {
  success: boolean;
  action: RecoveryAction;
  restored: boolean;
  verified: boolean;
  messages: string[];
}

export interface RecoveryAdapter {
  supports(type: FailureType): boolean;
  recover(
    failure: FailureEvent,
    checkpoint?: SystemCheckpoint
  ): Promise<RecoveryResult>;
}

export class SurvivalOrchestrator {
  private checkpoints = new Map<string, SystemCheckpoint>();
  private adapters: RecoveryAdapter[] = [];
  private safeMode = false;

  registerAdapter(adapter: RecoveryAdapter): void {
    if (!this.adapters.includes(adapter)) {
      this.adapters.push(adapter);
    }
  }

  saveCheckpoint(checkpoint: SystemCheckpoint): void {
    this.checkpoints.set(checkpoint.id, checkpoint);
  }

  getCheckpoint(id: string): SystemCheckpoint | undefined {
    return this.checkpoints.get(id);
  }

  enableSafeMode(): void {
    this.safeMode = true;
  }

  disableSafeMode(): void {
    this.safeMode = false;
  }

  isSafeMode(): boolean {
    return this.safeMode;
  }

  async recover(
    failure: FailureEvent,
    checkpointId?: string
  ): Promise<RecoveryResult> {
    const checkpoint = checkpointId
      ? this.checkpoints.get(checkpointId)
      : undefined;

    const adapter = this.adapters.find(a => a.supports(failure.type));

    if (!adapter) {
      this.enableSafeMode();

      return {
        success: false,
        action: "SAFE_MODE",
        restored: false,
        verified: false,
        messages: [
          `No recovery adapter for ${failure.type}.`,
          "System entered safe mode."
        ]
      };
    }

    const result = await adapter.recover(failure, checkpoint);

    if (!result.success || !result.verified) {
      this.enableSafeMode();
    }

    return result;
  }
}
