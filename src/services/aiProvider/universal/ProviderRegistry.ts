import {
  AICapability,
  ProviderCapabilityProfile,
} from './ProviderCapabilities';
import { UniversalAIRouter } from './UniversalAIRouter';

export interface ProviderHealth {
  provider: string;
  configured: boolean;
  healthy: boolean;
  checkedAt: number;
  reason?: string;
}

export interface ProviderResolution {
  provider: ProviderCapabilityProfile;
  reason: 'requested-provider' | 'requested-model' | 'capability-fallback';
}

export class ProviderRegistry {
  private readonly router = new UniversalAIRouter();
  private readonly health = new Map<string, ProviderHealth>();

  register(profile: ProviderCapabilityProfile): void {
    this.router.register(profile);

    if (!this.health.has(profile.provider)) {
      this.health.set(profile.provider, {
        provider: profile.provider,
        configured: true,
        healthy: true,
        checkedAt: Date.now(),
      });
    }
  }

  setHealth(
    provider: string,
    healthy: boolean,
    reason?: string,
  ): void {
    const current = this.health.get(provider);

    this.health.set(provider, {
      provider,
      configured: current?.configured ?? true,
      healthy,
      checkedAt: Date.now(),
      ...(reason ? { reason } : {}),
    });
  }

  resolve(
    capability: AICapability,
    requestedProvider?: string,
    requestedModel?: string,
  ): ProviderResolution | null {
    const candidates = this.router
      .list()
      .filter((profile) => profile.capabilities.includes(capability))
      .filter((profile) => {
        const status = this.health.get(profile.provider);
        return status?.configured !== false && status?.healthy !== false;
      });

    if (requestedProvider) {
      const provider = candidates.find(
        (item) =>
          item.provider === requestedProvider &&
          (!requestedModel || item.models.includes(requestedModel)),
      );

      return provider
        ? {
            provider,
            reason: requestedModel
              ? 'requested-model'
              : 'requested-provider',
          }
        : null;
    }

    const provider = candidates.find(
      (item) =>
        !requestedModel || item.models.includes(requestedModel),
    );

    return provider
      ? {
          provider,
          reason: 'capability-fallback',
        }
      : null;
  }

  getHealth(): ProviderHealth[] {
    return [...this.health.values()];
  }

  getProviders(): ProviderCapabilityProfile[] {
    return this.router.list();
  }
}
