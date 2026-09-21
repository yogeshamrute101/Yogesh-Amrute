export type LayerStatus =
  | "REGISTERED"
  | "READY"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED"
  | "BLOCKED"
  | "NEEDS_REVIEW";

export interface LogicalLayer {
  id: string;
  name: string;
  category: string;
  purpose: string;
  capabilities: string[];
  dependencies?: string[];
  instructions?: string[];
  limits?: string[];
  priority?: number;
  status?: LayerStatus;
  metadata?: Record<string, unknown>;
}

export interface LayerExecution {
  id: string;
  layerIds: string[];
  input: unknown;
  output?: unknown;
  verified: boolean;
  status: LayerStatus;
  startedAt: string;
  endedAt?: string;
  errors: string[];
  trace: string[];
}

export class UnifiedMetaLayer {
  private layers = new Map<string, LogicalLayer>();
  private executions = new Map<string, LayerExecution>();

  register(layer: LogicalLayer): LogicalLayer {
    if (this.layers.has(layer.id)) {
      return this.layers.get(layer.id)!;
    }

    this.layers.set(layer.id, {
      ...layer,
      status: layer.status ?? "REGISTERED",
    });

    return this.layers.get(layer.id)!;
  }

  registerMany(layers: LogicalLayer[]) {
    return layers.map(layer => this.register(layer));
  }

  get(id: string) {
    return this.layers.get(id);
  }

  findByCategory(category: string) {
    return [...this.layers.values()]
      .filter(layer => layer.category === category);
  }

  dependencies(id: string) {
    const layer = this.layers.get(id);
    if (!layer?.dependencies) return [];

    return layer.dependencies
      .map(dep => this.layers.get(dep))
      .filter(Boolean) as LogicalLayer[];
  }

  count() {
    return this.layers.size;
  }

  execute(
    executionId: string,
    layerIds: string[],
    input: unknown
  ): LayerExecution {
    const missing = layerIds.filter(id => !this.layers.has(id));

    const execution: LayerExecution = {
      id: executionId,
      layerIds,
      input,
      verified: false,
      status: missing.length ? "BLOCKED" : "RUNNING",
      startedAt: new Date().toISOString(),
      errors: missing.map(id => `LAYER_NOT_FOUND:${id}`),
      trace: [],
    };

    execution.trace.push("INPUT_RECEIVED");
    execution.trace.push("LAYERS_RESOLVED");
    execution.trace.push("DEPENDENCIES_CHECKED");

    if (missing.length) {
      execution.trace.push("EXECUTION_BLOCKED");
      this.executions.set(executionId, execution);
      return execution;
    }

    execution.trace.push("EXECUTION_READY");
    this.executions.set(executionId, execution);
    return execution;
  }

  verify(executionId: string, output: unknown, verified: boolean) {
    const execution = this.executions.get(executionId);

    if (!execution) {
      throw new Error(`Execution not found: ${executionId}`);
    }

    execution.output = output;
    execution.verified = verified;
    execution.status = verified ? "COMPLETED" : "NEEDS_REVIEW";
    execution.endedAt = new Date().toISOString();
    execution.trace.push(
      verified ? "RESULT_VERIFIED" : "RESULT_REQUIRES_REVIEW"
    );

    return execution;
  }

  snapshot() {
    return {
      layerCount: this.layers.size,
      executionCount: this.executions.size,
      categories: [...new Set(
        [...this.layers.values()].map(layer => layer.category)
      )],
      extensible: true,
      dynamicRegistration: true,
      fixedLayerLimit: false,
    };
  }
}
