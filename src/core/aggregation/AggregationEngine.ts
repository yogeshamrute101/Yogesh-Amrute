import type { AggregatedData } from "./types";
import type { AggregationStore } from "./AggregationStore";

export class AggregationEngine {
  constructor(private readonly store: AggregationStore) {}

  async aggregate(
    input: Omit<
      AggregatedData,
      "createdAt" | "updatedAt" | "version" | "status"
    >,
  ): Promise<AggregatedData> {
    const now = new Date().toISOString();

    const item: AggregatedData = {
      ...input,
      createdAt: now,
      updatedAt: now,
      version: 1,
      status: "aggregated",
    };

    await this.store.save(item);
    return item;
  }

  async get(id: string): Promise<AggregatedData | null> {
    return this.store.get(id);
  }

  async list(): Promise<AggregatedData[]> {
    return this.store.list();
  }
}
