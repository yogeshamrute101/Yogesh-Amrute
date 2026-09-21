export interface CorrelationEvent {
  systemId: string;
  timestamp: number;
  event: string;
  data?: Record<string, unknown>;
}

export interface Correlation {
  systems: string[];
  relationship: "TEMPORAL" | "DATA" | "DEPENDENCY" | "BEHAVIORAL";
  confidence: number;
  evidence: string[];
}

export class CorrelationEngine {
  correlate(events: CorrelationEvent[]): Correlation[] {
    const groups = new Map<number, CorrelationEvent[]>();

    for (const event of events) {
      const bucket = Math.floor(event.timestamp / 1000);
      const current = groups.get(bucket) ?? [];
      current.push(event);
      groups.set(bucket, current);
    }

    return [...groups.values()]
      .filter(group => new Set(group.map(x => x.systemId)).size > 1)
      .map(group => ({
        systems: [...new Set(group.map(x => x.systemId))],
        relationship: "TEMPORAL",
        confidence: Math.min(1, group.length / 5),
        evidence: group.map(x => `${x.systemId}:${x.event}`)
      }));
  }
}
