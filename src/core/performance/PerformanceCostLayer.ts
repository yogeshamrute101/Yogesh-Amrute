export type ResourceMetric = {
  name: string;
  value: number;
  unit: string;
  limit?: number;
};

export class PerformanceCostLayer {
  withinLimit(metric: ResourceMetric) {
    return metric.limit === undefined || metric.value <= metric.limit;
  }

  evaluate(metrics: ResourceMetric[]) {
    return metrics.map(metric => ({
      ...metric,
      withinLimit: this.withinLimit(metric)
    }));
  }
}
