export interface MemoryEvent {
  type: string;
  data: unknown;
  timestamp: number;
  source?: string;
}

export class MemoryEngine {
  private events: MemoryEvent[] = [];
  private knowledge = new Map<string, unknown>();

  log(event: Omit<MemoryEvent, 'timestamp'>) {
    this.events.push({
      ...event,
      timestamp: Date.now()
    });
  }

  remember(key: string, value: unknown) {
    this.knowledge.set(key, value);
  }

  recall(key: string) {
    return this.knowledge.get(key);
  }

  history() {
    return [...this.events];
  }
}
