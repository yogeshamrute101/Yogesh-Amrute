export type AuditEvent = {
  id: string;
  action: string;
  status: "started" | "completed" | "failed";
  timestamp: number;
  details?: string;
};

export class AuditLayer {
  private events: AuditEvent[] = [];

  record(event: AuditEvent) {
    this.events.push(event);
    return event;
  }

  history() {
    return [...this.events];
  }
}
