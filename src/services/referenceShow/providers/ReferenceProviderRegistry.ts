import type { ReferenceSource } from "../../../types/referenceShow/ReferenceSource";
import type { ReferenceIngestionProvider } from "./ReferenceIngestionProvider";

export class ReferenceProviderRegistry {
  private readonly providers: ReferenceIngestionProvider[] = [];

  register(provider: ReferenceIngestionProvider): void {
    if (!this.providers.some((p) => p.name === provider.name)) {
      this.providers.push(provider);
    }
  }

  resolve(source: ReferenceSource): ReferenceIngestionProvider {
    const provider = this.providers.find((candidate) =>
      candidate.canHandle(source)
    );

    if (!provider) {
      throw new Error(
        `No configured reference provider can handle source type: ${source.type}`
      );
    }

    return provider;
  }
}
