import {
  AIRequestRequirements,
  ProviderCapabilityProfile,
  supportsCapability,
} from './ProviderCapabilities';

export class UniversalAIRouter {
  constructor(
    private readonly providers: ProviderCapabilityProfile[] = [],
  ) {}

  register(profile: ProviderCapabilityProfile): void {
    const index = this.providers.findIndex(
      (item) => item.provider === profile.provider,
    );

    if (index >= 0) {
      this.providers[index] = profile;
    } else {
      this.providers.push(profile);
    }
  }

  resolve(requirements: AIRequestRequirements): ProviderCapabilityProfile | null {
    return (
      this.providers.find((provider) =>
        supportsCapability(provider, requirements),
      ) ?? null
    );
  }

  list(): ProviderCapabilityProfile[] {
    return [...this.providers];
  }
}
