import type { AggregatedData } from "./types";

export interface AggregationStore {
  save(item: AggregatedData): Promise<void>;
  get(id: string): Promise<AggregatedData | null>;
  list(): Promise<AggregatedData[]>;
  update(item: AggregatedData): Promise<void>;
  remove(id: string): Promise<void>;
}

export class MemoryAggregationStore implements AggregationStore {
  private readonly data = new Map<string, AggregatedData>();

  async save(item: AggregatedData): Promise<void> {
    this.data.set(item.id, item);
  }

  async get(id: string): Promise<AggregatedData | null> {
    return this.data.get(id) ?? null;
  }

  async list(): Promise<AggregatedData[]> {
    return Array.from(this.data.values());
  }

  async update(item: AggregatedData): Promise<void> {
    this.data.set(item.id, item);
  }

  async remove(id: string): Promise<void> {
    this.data.delete(id);
  }
}
