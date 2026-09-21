export type SystemEvent = {
  type:
    | "OBSERVED"
    | "RESEARCHED"
    | "DECIDED"
    | "PLANNED"
    | "EXECUTED"
    | "VERIFIED"
    | "LEARNED"
    | "FAILED";
  source: string;
  payload?: unknown;
  timestamp: number;
};

export class SystemEventBus {
  private events: SystemEvent[] = [];

  emit(event: SystemEvent) {
    this.events.push(event);
    return event;
  }

  history() {
    return [...this.events];
  }

  latest() {
    return this.events[this.events.length - 1];
  }
}
