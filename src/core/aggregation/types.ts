export type AggregationStatus =
  | "raw"
  | "normalized"
  | "validated"
  | "aggregated"
  | "archived";

export interface AggregatedData {
  id: string;
  source: string;
  type: string;
  content: unknown;
  createdAt: string;
  updatedAt: string;
  version: number;
  status: AggregationStatus;
  relations: string[];
  confidence?: number;
  metadata?: Record<string, unknown>;
}
