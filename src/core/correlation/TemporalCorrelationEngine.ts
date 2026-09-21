export interface TimedEvent {
  id: string;
  type: string;
  timestamp: number;
}

export interface TemporalCorrelation {
  eventA: string;
  eventB: string;
  lagMs: number;
  repeated: boolean;
  observations: number;
}

export class TemporalCorrelationEngine {
  analyze(
    a: TimedEvent[],
    b: TimedEvent[],
    windowMs = 5000
  ): TemporalCorrelation[] {
    const results: TemporalCorrelation[] = [];

    for (const first of a) {
      for (const second of b) {
        const lag = second.timestamp - first.timestamp;

        if (Math.abs(lag) <= windowMs) {
          results.push({
            eventA: first.type,
            eventB: second.type,
            lagMs: lag,
            repeated: false,
            observations: 1,
          });
        }
      }
    }

    const counts = new Map<string, number>();

    for (const result of results) {
      const key = `${result.eventA}|${result.eventB}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    return results.map(result => ({
      ...result,
      repeated:
        (counts.get(`${result.eventA}|${result.eventB}`) ?? 0) > 1,
      observations:
        counts.get(`${result.eventA}|${result.eventB}`) ?? 1,
    }));
  }
}
