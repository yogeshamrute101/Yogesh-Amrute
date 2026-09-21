export type ContinuousState = {
  version: number;
  timestamp: number;
  running: boolean;
  cycle: number;
  phase: string;
};

export class ContinuousStateStore {
  private state: ContinuousState = {
    version: 1,
    timestamp: Date.now(),
    running: false,
    cycle: 0,
    phase: "IDLE"
  };

  save(state: Partial<ContinuousState>) {
    this.state = {
      ...this.state,
      ...state,
      timestamp: Date.now()
    };

    return { ...this.state };
  }

  restore() {
    return { ...this.state };
  }
}
