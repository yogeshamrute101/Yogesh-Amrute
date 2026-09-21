export type AIProvider =
  | "LOCAL"
  | "OPENAI"
  | "GEMINI"
  | "ANTHROPIC"
  | "META"
  | "CLOUD";

export type AITask =
  | "CHAT"
  | "CODE"
  | "DEBUG"
  | "RESEARCH"
  | "DOCUMENT"
  | "CREATIVE"
  | "VIDEO"
  | "ANALYZE"
  | "PLAN"
  | "AUTOMATE"
  | "SYSTEM";

export interface AIRequest {
  task: AITask;
  prompt: string;
  context?: Record<string, unknown>;
  preferredProvider?: AIProvider;
  requireApproval?: boolean;
}

export interface AIResponse {
  success: boolean;
  provider: AIProvider;
  task: AITask;
  answer: string;
  actions: string[];
  evidence: string[];
  confidence: number;
  requiresApproval: boolean;
  timestamp: number;
}

export interface AIProviderAdapter {
  provider: AIProvider;
  available(): boolean | Promise<boolean>;
  execute(request: AIRequest): Promise<AIResponse>;
}

/**
 * Universal AI orchestration layer.
 *
 * This is an orchestration interface, not a copy of any proprietary
 * model, weights, code, or internal implementation.
 */
export class UniversalAIHub {
  private providers = new Map<AIProvider, AIProviderAdapter>();

  registerProvider(adapter: AIProviderAdapter): void {
    this.providers.set(adapter.provider, adapter);
  }

  listProviders(): AIProvider[] {
    return [...this.providers.keys()];
  }

  async run(request: AIRequest): Promise<AIResponse> {
    const candidates = request.preferredProvider
      ? [request.preferredProvider]
      : this.providers.keys();

    for (const provider of candidates) {
      const adapter = this.providers.get(provider);

      if (!adapter) continue;

      if (!(await adapter.available())) continue;

      const response = await adapter.execute(request);

      return {
        ...response,
        requiresApproval:
          request.requireApproval === true || response.requiresApproval,
        timestamp: Date.now(),
      };
    }

    return {
      success: false,
      provider: "LOCAL",
      task: request.task,
      answer: "No authorized AI provider is currently available.",
      actions: [],
      evidence: [],
      confidence: 0,
      requiresApproval: true,
      timestamp: Date.now(),
    };
  }

  async chat(prompt: string, context?: Record<string, unknown>) {
    return this.run({
      task: "CHAT",
      prompt,
      context,
    });
  }

  async code(prompt: string, context?: Record<string, unknown>) {
    return this.run({
      task: "CODE",
      prompt,
      context,
      requireApproval: true,
    });
  }

  async research(prompt: string, context?: Record<string, unknown>) {
    return this.run({
      task: "RESEARCH",
      prompt,
      context,
    });
  }

  async debug(prompt: string, context?: Record<string, unknown>) {
    return this.run({
      task: "DEBUG",
      prompt,
      context,
      requireApproval: true,
    });
  }

  async video(prompt: string, context?: Record<string, unknown>) {
    return this.run({
      task: "VIDEO",
      prompt,
      context,
    });
  }
}
