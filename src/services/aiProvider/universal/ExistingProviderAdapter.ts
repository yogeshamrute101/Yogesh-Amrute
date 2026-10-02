import {
  AICapability,
  ProviderCapabilityProfile,
} from './ProviderCapabilities';

export interface ExistingProviderAdapter {
  readonly profile: ProviderCapabilityProfile;
  isConfigured(): boolean;
  execute?: (...args: unknown[]) => Promise<unknown>;
}

export function createProviderProfile(
  provider: string,
  models: string[],
  capabilities: AICapability[],
): ProviderCapabilityProfile {
  return {
    provider,
    models,
    capabilities,
    supportsStreaming: true,
    supportsToolCalling: true,
    supportsStructuredOutput: true,
  };
}
