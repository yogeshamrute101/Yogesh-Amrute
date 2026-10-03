import type {
  AIProviderCapability,
  AIProviderContract,
} from "../../types/provider/AIProviderContract";

export interface ProviderExecutionRequest {
  capability: AIProviderCapability;
  input: unknown;
  timeoutMs?: number;
}

export interface ProviderExecutionResult {
  providerId: string;
  capability: AIProviderCapability;
  output: unknown;
  verified: boolean;
}

export interface ExecutableAIProvider extends AIProviderContract {
  execute(
    request: ProviderExecutionRequest,
  ): Promise<unknown>;
}

export class UniversalProviderRuntime {
  constructor(
    private readonly providers: ExecutableAIProvider[],
  ) {}

  async execute(
    request: ProviderExecutionRequest,
  ): Promise<ProviderExecutionResult> {
    const candidates = this.providers.filter((provider) => {
      const status = provider.status();
      return (
        status.configured &&
        status.healthy &&
        provider.capabilities().includes(request.capability)
      );
    });

    if (candidates.length === 0) {
      throw new Error(
        `No configured provider available for capability: ${request.capability}`,
      );
    }

    let lastError: unknown;

    for (const provider of candidates) {
      try {
        const output = await provider.execute(request);

        if (output === undefined || output === null) {
          throw new Error(
            `Provider ${provider.id} returned no output`,
          );
        }

        return {
          providerId: provider.id,
          capability: request.capability,
          output,
          verified: true,
        };
      } catch (error) {
        lastError = error;
      }
    }

    throw new Error(
      `All configured providers failed for ${request.capability}: ${String(lastError)}`,
    );
  }
}
