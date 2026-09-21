export interface StatisticsSummary {
  count: number;
  mean?: number;
  median?: number;
  minimum?: number;
  maximum?: number;
  standardDeviation?: number;
}

export class StatisticsEngine {
  summarize(values: number[]): StatisticsSummary {
    if (!values.length) return { count: 0 };

    const sorted = [...values].sort((a, b) => a - b);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const middle = Math.floor(sorted.length / 2);
    const median =
      sorted.length % 2
        ? sorted[middle]
        : (sorted[middle - 1] + sorted[middle]) / 2;

    const variance =
      values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
      values.length;

    return {
      count: values.length,
      mean,
      median,
      minimum: sorted[0],
      maximum: sorted[sorted.length - 1],
      standardDeviation: Math.sqrt(variance),
    };
  }
}
