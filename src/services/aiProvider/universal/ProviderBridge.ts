import {
  ProviderCapabilityProfile,
} from './ProviderCapabilities';
import {
  RuntimeProviderManager,
} from './RuntimeProviderManager';

export interface ProviderBridge {
  profile: ProviderCapabilityProfile;
  execute?: (...args: unknown[]) => Promise<unknown>;
  configured?: () => boolean;
}

export function attachProviderBridge(
  runtime: RuntimeProviderManager,
  bridge: ProviderBridge,
): void {
  runtime.register(
    bridge.profile,
    bridge.execute
      ? async ({ request }) => bridge.execute!(request.input)
      : undefined,
  );

  if (bridge.configured && !bridge.configured()) {
    runtime.markUnavailable(
      bridge.profile.provider,
      'Provider configuration is unavailable.',
    );
  }
}
