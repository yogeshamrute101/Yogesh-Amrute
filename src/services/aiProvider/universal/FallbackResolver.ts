import { ProviderCapabilityProfile } from './ProviderCapabilities';
import { ProviderRegistry } from './ProviderRegistry';

export interface FallbackResolution {
  provider: ProviderCapabilityProfile;
  fallbackUsed: boolean;
}

export function resolveWithFallback(
  registry: ProviderRegistry,
  capability: ProviderCapabilityProfile['capabilities'][number],
  requestedProvider?: string,
  requestedModel?: string,
): FallbackResolution {
  if (requestedProvider || requestedModel) {
    const requested = registry.resolve(
      capability,
      requestedProvider,
      requestedModel,
    );

    if (requested) {
      return {
        provider: requested.provider,
        fallbackUsed: false,
      };
    }
  }

  const fallback = registry.resolve(capability);

  if (!fallback) {
    throw new Error(
      `No healthy configured provider is available for capability "${capability}".`,
    );
  }

  return {
    provider: fallback.provider,
    fallbackUsed: true,
  };
}
