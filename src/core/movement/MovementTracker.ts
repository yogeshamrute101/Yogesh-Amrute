import { Movement } from "./UniversalMovementEngine";

export class MovementTracker {
  private history: Movement[] = [];

  record(move: Movement) {
    this.history.push({ ...move });
    return move;
  }

  recent(limit = 50) {
    return [...this.history]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  forDomain(domain: Movement["domain"]) {
    return this.history.filter(x => x.domain === domain);
  }

  between(start: number, end: number) {
    return this.history.filter(
      x => x.timestamp >= start && x.timestamp <= end
    );
  }
}
