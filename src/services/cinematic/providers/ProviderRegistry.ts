export interface CinematicVideoProvider {
  readonly id: string;
  isConfigured(): boolean;
  generate(request: unknown): Promise<unknown>;
}

export class ProviderRegistry {
  private readonly providers = new Map<string, CinematicVideoProvider>();

  register(provider: CinematicVideoProvider): void {
    if (!provider.id) {
      throw new Error("Provider id is required");
    }

    this.providers.set(provider.id, provider);
  }

  get(id: string): CinematicVideoProvider | undefined {
    return this.providers.get(id);
  }

  list(): CinematicVideoProvider[] {
    return [...this.providers.values()];
  }

  configured(): CinematicVideoProvider[] {
    return this.list().filter((provider) => provider.isConfigured());
  }
}
