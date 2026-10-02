import { ProviderRegistry } from './ProviderRegistry';
import {
  UniversalAIExecutor,
  AIProviderExecutor,
} from './UniversalAIExecutor';
import { ProviderCapabilityProfile } from './ProviderCapabilities';

export class RuntimeProviderManager {
  readonly registry: ProviderRegistry;
  readonly executor: UniversalAIExecutor;

  constructor() {
    this.registry = new ProviderRegistry();
    this.executor = new UniversalAIExecutor(this.registry);
  }

  register(
    profile: ProviderCapabilityProfile,
    executor?: AIProviderExecutor,
  ): void {
    this.registry.register(profile);

    if (executor) {
      this.executor.registerExecutor(profile.provider, executor);
    }
  }

  markUnavailable(provider: string, reason: string): void {
    this.registry.setHealth(provider, false, reason);
  }

  markHealthy(provider: string): void {
    this.registry.setHealth(provider, true);
  }
}
