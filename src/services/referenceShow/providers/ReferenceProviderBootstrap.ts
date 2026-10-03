import { ReferenceProviderRegistry } from "./ReferenceProviderRegistry";
import { UnconfiguredReferenceIngestionProvider } from "./ReferenceIngestionProvider";

export function createReferenceProviderRegistry(): ReferenceProviderRegistry {
  const registry = new ReferenceProviderRegistry();

  registry.register(new UnconfiguredReferenceIngestionProvider());

  return registry;
}
