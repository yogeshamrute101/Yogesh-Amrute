import {
  AICapability,
  ProviderCapabilityProfile,
} from './ProviderCapabilities';
import { ProviderRegistry } from './ProviderRegistry';

export interface CapabilityRoute {
  capability: AICapability;
  provider: string;
  model?: string;
}

export class CapabilityRegistry {
  private readonly registry: ProviderRegistry;

  constructor(registry?: ProviderRegistry) {
    this.registry = registry ?? new ProviderRegistry();
  }

  registerProvider(profile: ProviderCapabilityProfile): void {
    this.registry.register(profile);
  }

  resolve(
    capability: AICapability,
    options?: {
      provider?: string;
      model?: string;
    },
  ): CapabilityRoute | null {
    const result = this.registry.resolve(
      capability,
      options?.provider,
      options?.model,
    );

    if (!result) return null;

    return {
      capability,
      provider: result.provider.provider,
      ...(options?.model ? { model: options.model } : {}),
    };
  }

  providers(): ProviderCapabilityProfile[] {
    return this.registry.getProviders();
  }

  health() {
    return this.registry.getHealth();
  }
}
