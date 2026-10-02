import { getUniversalRuntime } from './UniversalRuntimeHub';

let bootstrapped = false;

export function bootstrapUniversalProviders(): void {
  if (bootstrapped) return;

  const runtime = getUniversalRuntime();

  // Provider registration is intentionally kept explicit.
  // Existing providers remain the source of truth for real API execution.
  void runtime;

  bootstrapped = true;
}

export function isUniversalProviderBootstrapComplete(): boolean {
  return bootstrapped;
}
