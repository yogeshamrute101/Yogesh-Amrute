import { SystemEvent } from "../types";

export class AutonomousMonitor {
  private events: SystemEvent[] = [];

  emit(
    type: string,
    message: string,
    taskId?: string,
    metadata?: Record<string, unknown>
  ) {
    const event: SystemEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type,
      message,
      timestamp: Date.now(),
      taskId,
      metadata,
    };

    this.events.push(event);

    return event;
  }

  recent(limit = 50) {
    return this.events.slice(-limit);
  }

  all() {
    return [...this.events];
  }
}
