import { getUniversalRuntime } from './UniversalRuntimeHub';

export interface UniversalProviderStatus {
  provider: string;
  models: string[];
  capabilities: string[];
  configured: boolean;
  healthy: boolean;
  reason?: string;
}

export function getUniversalProviderStatus(): UniversalProviderStatus[] {
  const runtime = getUniversalRuntime();
  const providers = runtime.registry.getProviders();
  const health = runtime.registry.getHealth();

  return providers.map((provider) => {
    const status = health.find(
      (item) => item.provider === provider.provider,
    );

    return {
      provider: provider.provider,
      models: [...provider.models],
      capabilities: [...provider.capabilities],
      configured: status?.configured ?? true,
      healthy: status?.healthy ?? true,
      ...(status?.reason ? { reason: status.reason } : {}),
    };
  });
}

export function getAvailableCapabilities(): string[] {
  const capabilities = new Set<string>();

  for (const provider of getUniversalProviderStatus()) {
    if (!provider.configured || !provider.healthy) continue;

    for (const capability of provider.capabilities) {
      capabilities.add(capability);
    }
  }

  return [...capabilities].sort();
}
