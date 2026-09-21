import { LogicalLayer, UnifiedMetaLayer } from "./UnifiedMetaLayer";

export class LayerAggregationEngine {
  constructor(private readonly metaLayer = new UnifiedMetaLayer()) {}

  aggregate(layers: LogicalLayer[]) {
    return this.metaLayer.registerMany(layers);
  }

  aggregateFromManifest(manifest: {
    id: string;
    name: string;
    category: string;
    purpose?: string;
    capabilities?: string[];
  }[]) {
    return this.aggregate(
      manifest.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        purpose: item.purpose ?? "Registered system capability",
        capabilities: item.capabilities ?? [],
      }))
    );
  }

  getUnifiedLayer() {
    return this.metaLayer;
  }
}
