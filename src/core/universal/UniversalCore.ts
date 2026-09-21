/**
 * VidoAI Universal Core
 *
 * Goal:
 * Keep application logic independent from specific data systems,
 * processors, storage implementations and service providers.
 *
 * The core decides WHAT needs to happen.
 * Adapters decide HOW/WHERE it happens.
 *
 * Never bypass the host operating system's fundamental resources.
 */

export type ResourceKind =
  | "compute"
  | "memory"
  | "storage"
  | "network"
  | "model"
  | "media"
  | "database"
  | "external-service";

export interface Resource {
  id: string;
  kind: ResourceKind;
  capabilities: string[];
  available: boolean;
  metadata?: Record<string, unknown>;
}

export interface ProcessingTask<T = unknown> {
  id: string;
  operation: string;
  input: T;
  requirements?: string[];
}

export interface ProcessingResult<T = unknown> {
  success: boolean;
  output?: T;
  error?: string;
  resourceId?: string;
}

export interface UniversalAdapter {
  canHandle(task: ProcessingTask): boolean;
  execute<T, R>(task: ProcessingTask<T>): Promise<ProcessingResult<R>>;
}

export class UniversalCore {
  private readonly adapters: UniversalAdapter[] = [];

  register(adapter: UniversalAdapter): void {
    this.adapters.push(adapter);
  }

  async process<T, R>(
    task: ProcessingTask<T>,
  ): Promise<ProcessingResult<R>> {
    const adapter = this.adapters.find((item) => item.canHandle(task));

    if (!adapter) {
      return {
        success: false,
        error: `No compatible capability found for operation: ${task.operation}`,
      };
    }

    return adapter.execute<T, R>(task);
  }
}
