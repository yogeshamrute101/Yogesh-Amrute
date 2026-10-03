import {
  KnowledgeAggregationRuntime,
} from "./KnowledgeAggregationRuntime";
import type {
  KnowledgeSourceRecord,
} from "./KnowledgeAggregationRuntime";

export class KnowledgeRuntime {
  private readonly aggregator =
    new KnowledgeAggregationRuntime();

  aggregate(records: KnowledgeSourceRecord[]) {
    return this.aggregator.aggregate(records);
  }
}
