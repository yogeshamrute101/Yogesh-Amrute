import { RuntimeProviderManager } from './RuntimeProviderManager';

let runtime: RuntimeProviderManager | null = null;

export function getUniversalRuntime(): RuntimeProviderManager {
  if (!runtime) {
    runtime = new RuntimeProviderManager();
  }

  return runtime;
}

export function registerUniversalProvider(
  profile: Parameters<RuntimeProviderManager['register']>[0],
  executor?: Parameters<RuntimeProviderManager['register']>[1],
): void {
  getUniversalRuntime().register(profile, executor);
}

export function resetUniversalRuntime(): void {
  runtime = null;
}
