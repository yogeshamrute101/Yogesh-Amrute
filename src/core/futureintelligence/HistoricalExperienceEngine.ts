/**
 * Historical Experience Engine
 *
 * Converts historical observations into reusable patterns.
 * It does not treat history as a guarantee of future behavior.
 */

export type EvidenceQuality =
  | "VERIFIED"
  | "STRONG"
  | "LIMITED"
  | "CONFLICTING"
  | "UNKNOWN";

export interface HistoricalObservation {
  id: string;
  timestamp: number;
  domain: string;
  conditions: Record<string, unknown>;
  outcome: string;
  evidenceQuality: EvidenceQuality;
  source?: string;
}

export interface HistoricalPattern {
  id: string;
  domain: string;
  conditions: Record<string, unknown>;
  outcomes: Array<{
    outcome: string;
    observations: number;
  }>;
  confidence: number;
}

export class HistoricalExperienceEngine {
  private observations: HistoricalObservation[] = [];

  addObservation(observation: HistoricalObservation): void {
    this.observations.push(observation);
  }

  getObservations(domain?: string): HistoricalObservation[] {
    if (!domain) return [...this.observations];
    return this.observations.filter(x => x.domain === domain);
  }

  findPatterns(domain: string): HistoricalPattern[] {
    const items = this.getObservations(domain);
    const groups = new Map<string, HistoricalObservation[]>();

    for (const item of items) {
      const key = JSON.stringify(item.conditions);
      const group = groups.get(key) ?? [];
      group.push(item);
      groups.set(key, group);
    }

    return [...groups.entries()].map(([conditions, group], index) => {
      const outcomes = new Map<string, number>();

      for (const item of group) {
        outcomes.set(
          item.outcome,
          (outcomes.get(item.outcome) ?? 0) + 1
        );
      }

      return {
        id: `pattern-${domain}-${index}`,
        domain,
        conditions: JSON.parse(conditions),
        outcomes: [...outcomes.entries()].map(([outcome, observations]) => ({
          outcome,
          observations
        })),
        confidence: Math.min(1, group.length / 100)
      };
    });
  }
}
