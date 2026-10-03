import type {
  AIProviderCapability,
  AIProviderContract,
} from "../../types/provider/AIProviderContract";

export class AIProviderRegistry {
  private readonly providers = new Map<string, AIProviderContract>();

  register(provider: AIProviderContract): void {
    this.providers.set(provider.id, provider);
  }

  list(): AIProviderContract[] {
    return [...this.providers.values()];
  }

  configuredFor(capability: AIProviderCapability): AIProviderContract[] {
    return this.list().filter(
      (provider) =>
        provider.status().configured &&
        provider.status().healthy &&
        provider.capabilities().includes(capability),
    );
  }

  requireConfigured(capability: AIProviderCapability): AIProviderContract {
    const provider = this.configuredFor(capability)[0];

    if (!provider) {
      throw new Error(
        `No configured healthy AI provider supports capability: ${capability}`,
      );
    }

    return provider;
  }
}
