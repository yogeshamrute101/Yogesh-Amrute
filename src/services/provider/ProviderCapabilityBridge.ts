import type {
  AIProviderCapability,
  AIProviderContract,
} from "../../types/provider/AIProviderContract";

export interface ProviderAdapter {
  provider: AIProviderContract;
  execute(input: unknown): Promise<unknown>;
}

export class ProviderCapabilityBridge {
  private readonly adapters = new Map<
    AIProviderCapability,
    ProviderAdapter[]
  >();

  register(
    capability: AIProviderCapability,
    adapter: ProviderAdapter,
  ): void {
    const current = this.adapters.get(capability) ?? [];
    current.push(adapter);
    this.adapters.set(capability, current);
  }

  available(
    capability: AIProviderCapability,
  ): ProviderAdapter[] {
    return (this.adapters.get(capability) ?? []).filter(
      (adapter) => {
        const status = adapter.provider.status();
        return status.configured && status.healthy;
      },
    );
  }

  async execute(
    capability: AIProviderCapability,
    input: unknown,
  ): Promise<unknown> {
    const candidates = this.available(capability);

    if (!candidates.length) {
      throw new Error(
        `No configured healthy provider for ${capability}`,
      );
    }

    let lastError: unknown;

    for (const candidate of candidates) {
      try {
        const output = await candidate.execute(input);

        if (output === undefined || output === null) {
          throw new Error(
            `Provider ${candidate.provider.id} returned empty output`,
          );
        }

        return output;
      } catch (error) {
        lastError = error;
      }
    }

    throw new Error(
      `All configured providers failed: ${String(lastError)}`,
    );
  }
}
