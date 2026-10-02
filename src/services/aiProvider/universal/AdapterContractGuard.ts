import { ProviderCapabilityProfile } from './ProviderCapabilities';
import { RuntimeProviderManager } from './RuntimeProviderManager';

export interface VerifiedProviderAdapter {
  profile: ProviderCapabilityProfile;
  execute: (input: unknown) => Promise<unknown>;
  configured?: () => boolean;
}

export function registerVerifiedAdapter(
  runtime: RuntimeProviderManager,
  adapter: VerifiedProviderAdapter,
): void {
  if (!adapter.profile.provider.trim()) {
    throw new Error('Provider adapter requires a provider identifier.');
  }

  if (adapter.profile.capabilities.length === 0) {
    throw new Error(
      `Provider "${adapter.profile.provider}" has no declared capabilities.`,
    );
  }

  if (typeof adapter.execute !== 'function') {
    throw new Error(
      `Provider "${adapter.profile.provider}" has no execution adapter.`,
    );
  }

  runtime.register(adapter.profile, async ({ request }) => {
    return adapter.execute(request.input);
  });

  if (adapter.configured && !adapter.configured()) {
    runtime.markUnavailable(
      adapter.profile.provider,
      'Provider configuration is unavailable.',
    );
  }
}
