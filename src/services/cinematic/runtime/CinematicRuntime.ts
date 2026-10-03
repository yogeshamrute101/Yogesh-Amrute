import type { CinematicVideoProvider } from "../providers/ProviderRegistry";

export class CinematicRuntime {
  constructor(
    private readonly provider: CinematicVideoProvider
  ) {}

  async render(request: unknown): Promise<unknown> {
    if (!this.provider.isConfigured()) {
      throw new Error(
        `Cinematic provider "${this.provider.id}" is not configured`
      );
    }

    return this.provider.generate(request);
  }
}
