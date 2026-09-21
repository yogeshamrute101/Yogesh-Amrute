export type PerceptionType = "watch" | "read" | "hear";

export interface PerceptionInput {
  id: string;
  type: PerceptionType;
  timestamp: number;
  source?: string;
  content: unknown;
  metadata?: Record<string, unknown>;
}

export interface PerceptionResult {
  inputId: string;
  type: PerceptionType;
  observations: string[];
  evidence: unknown;
  confidence: number;
  timestamp: number;
}

export class MultimodalPerception {
  observe(input: PerceptionInput): PerceptionResult {
    const observations: string[] = [];

    if (input.type === "watch") {
      observations.push("Visual input received");
    }

    if (input.type === "read") {
      observations.push("Readable/text input received");
    }

    if (input.type === "hear") {
      observations.push("Audio input received");
    }

    return {
      inputId: input.id,
      type: input.type,
      observations,
      evidence: input.content,
      confidence: 0,
      timestamp: input.timestamp,
    };
  }

  observeMany(inputs: PerceptionInput[]): PerceptionResult[] {
    return inputs.map((input) => this.observe(input));
  }
}
