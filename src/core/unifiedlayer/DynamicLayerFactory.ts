import { LogicalLayer, UnifiedMetaLayer } from "./UnifiedMetaLayer";

export class DynamicLayerFactory {
  constructor(private readonly metaLayer: UnifiedMetaLayer) {}

  create(
    id: string,
    category: string,
    purpose: string,
    capabilities: string[] = []
  ) {
    const layer: LogicalLayer = {
      id,
      name: id,
      category,
      purpose,
      capabilities,
      status: "REGISTERED",
    };

    return this.metaLayer.register(layer);
  }

  createBatch(
    prefix: string,
    count: number,
    category = "CUSTOM"
  ) {
    if (!Number.isInteger(count) || count < 0) {
      throw new Error("count must be a non-negative integer");
    }

    const created: LogicalLayer[] = [];

    for (let i = 1; i <= count; i++) {
      created.push(
        this.create(
          `${prefix}-${i}`,
          category,
          "Dynamically registered logical layer"
        )
      );
    }

    return created;
  }
}
