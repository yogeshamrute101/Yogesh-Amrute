export type SenseType =
  | "visual"
  | "audio"
  | "text"
  | "environment"
  | "system"
  | "context";

export interface SenseInput {
  id: string;
  type: SenseType;
  value: unknown;
  timestamp: number;
  source?: string;
  confidence?: number;
}

export interface SystemState {
  stateId: string;
  signals: string[];
  conditions: Record<string, unknown>;
  confidence: number;
  timestamp: number;
}

export class SenseEngine {
  sense(inputs: SenseInput[]): SystemState {
    const signals = inputs.map(
      (input) => `${input.type}:${String(input.value)}`
    );

    const confidence =
      inputs.length === 0
        ? 0
        : inputs.reduce(
            (sum, input) => sum + (input.confidence ?? 0.5),
            0
          ) / inputs.length;

    return {
      stateId: `state-${Date.now()}`,
      signals,
      conditions: {
        inputCount: inputs.length,
        sources: [...new Set(inputs.map((i) => i.source).filter(Boolean))],
      },
      confidence,
      timestamp: Date.now(),
    };
  }
}
