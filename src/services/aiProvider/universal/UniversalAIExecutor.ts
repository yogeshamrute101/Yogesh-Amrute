import {
  AICapability,
  ProviderCapabilityProfile,
} from './ProviderCapabilities';
import { ProviderRegistry } from './ProviderRegistry';
import {
  AIModelUnavailableError,
  AIProviderUnavailableError,
} from './CapabilityErrors';

export interface AIExecutionRequest {
  capability: AICapability;
  input: unknown;
  provider?: string;
  model?: string;
}

export interface AIExecutionContext {
  provider: ProviderCapabilityProfile;
  request: AIExecutionRequest;
}

export type AIProviderExecutor = (
  context: AIExecutionContext,
) => Promise<unknown>;

export class UniversalAIExecutor {
  private readonly executors = new Map<string, AIProviderExecutor>();

  constructor(private readonly registry: ProviderRegistry) {}

  registerExecutor(
    provider: string,
    executor: AIProviderExecutor,
  ): void {
    this.executors.set(provider, executor);
  }

  async execute(request: AIExecutionRequest): Promise<unknown> {
    const resolved = this.registry.resolve(
      request.capability,
      request.provider,
      request.model,
    );

    if (!resolved) {
      if (request.model) {
        throw new AIModelUnavailableError(
          `No healthy provider supports model "${request.model}" for capability "${request.capability}".`,
        );
      }

      throw new AIProviderUnavailableError(
        `No healthy provider supports capability "${request.capability}".`,
        request.capability,
      );
    }

    const executor = this.executors.get(resolved.provider.provider);

    if (!executor) {
      throw new AIProviderUnavailableError(
        `Provider "${resolved.provider.provider}" is registered but has no execution adapter.`,
        request.capability,
      );
    }

    return executor({
      provider: resolved.provider,
      request,
    });
  }

  hasExecutor(provider: string): boolean {
    return this.executors.has(provider);
  }
}
