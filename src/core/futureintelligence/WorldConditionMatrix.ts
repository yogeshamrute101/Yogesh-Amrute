/**
 * World Condition Matrix
 *
 * Organizes interacting conditions before forecasting.
 */

export interface WorldCondition {
  domain: string;
  factor: string;
  value: unknown;
  timestamp: number;
  confidence: number;
  source?: string;
}

export class WorldConditionMatrix {
  private conditions: WorldCondition[] = [];

  set(condition: WorldCondition): void {
    this.conditions.push(condition);
  }

  all(): WorldCondition[] {
    return [...this.conditions];
  }

  byDomain(domain: string): WorldCondition[] {
    return this.conditions.filter(x => x.domain === domain);
  }

  averageConfidence(): number {
    if (!this.conditions.length) return 0;

    return this.conditions.reduce(
      (sum, item) => sum + item.confidence,
      0
    ) / this.conditions.length;
  }
}
