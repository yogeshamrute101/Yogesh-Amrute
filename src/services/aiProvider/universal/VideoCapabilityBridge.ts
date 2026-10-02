import { ProviderCapabilityProfile } from './ProviderCapabilities';
import { RuntimeProviderManager } from './RuntimeProviderManager';

export const VIDEO_CAPABILITY_PROFILE: ProviderCapabilityProfile = {
  provider: 'google-video',
  models: [],
  capabilities: ['video'],
  supportsStreaming: false,
  supportsToolCalling: false,
  supportsStructuredOutput: false,
};

export function registerVideoCapability(
  runtime: RuntimeProviderManager,
  execute: (...args: unknown[]) => Promise<unknown>,
): void {
  runtime.register(
    VIDEO_CAPABILITY_PROFILE,
    async ({ request }) => execute(request.input),
  );
}
