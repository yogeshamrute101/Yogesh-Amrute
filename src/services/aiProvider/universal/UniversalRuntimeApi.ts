import { getUniversalRuntime } from './UniversalRuntimeHub';
import { getUniversalProviderStatus } from './ProviderControlPlane';
import { AIExecutionRequest } from './UniversalAIExecutor';

export interface UniversalRuntimeSnapshot {
  providers: ReturnType<typeof getUniversalProviderStatus>;
  capabilities: string[];
}

export function getUniversalRuntimeSnapshot(): UniversalRuntimeSnapshot {
  const providers = getUniversalProviderStatus();
  const capabilities = [
    ...new Set(
      providers
        .filter((provider) => provider.configured && provider.healthy)
        .flatMap((provider) => provider.capabilities),
    ),
  ].sort();

  return {
    providers,
    capabilities,
  };
}

export async function executeUniversalRequest(
  request: AIExecutionRequest,
): Promise<unknown> {
  return getUniversalRuntime().executor.execute(request);
}
