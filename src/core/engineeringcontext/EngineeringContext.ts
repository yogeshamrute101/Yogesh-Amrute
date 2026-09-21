export type EngineeringEvent =
  | "COMMAND"
  | "OUTPUT"
  | "ERROR"
  | "FIX"
  | "LINT"
  | "BUILD"
  | "TEST"
  | "VERIFICATION";

export type EngineeringRecord = {
  event: EngineeringEvent;
  command?: string;
  result?: string;
  success?: boolean;
  timestamp: number;
};

export class EngineeringContext {
  private history: EngineeringRecord[] = [];

  record(record: EngineeringRecord) {
    this.history.push(record);
    return record;
  }

  recent(limit = 20) {
    return this.history.slice(-limit);
  }

  lastFailure() {
    return [...this.history].reverse()
      .find(x => x.success === false);
  }

  lastSuccess() {
    return [...this.history].reverse()
      .find(x => x.success === true);
  }
}
