export type LifePhase =
  | "OBSERVE"
  | "UNDERSTAND"
  | "THINK"
  | "PLAN"
  | "ACT"
  | "VERIFY"
  | "LEARN"
  | "RECOVER"
  | "IDLE";

export type LifeState = {
  phase: LifePhase;
  cycle: number;
  running: boolean;
  lastHeartbeat: number;
  lastError?: string;
};

export type LifeLoopOptions = {
  intervalMs?: number;
  onCycle?: (state: LifeState) => Promise<void> | void;
  onError?: (error: unknown, state: LifeState) => Promise<void> | void;
};

export class ContinuousLifeLoop {
  private state: LifeState = {
    phase: "IDLE",
    cycle: 0,
    running: false,
    lastHeartbeat: Date.now()
  };

  private timer?: ReturnType<typeof setTimeout>;
  private options: Required<LifeLoopOptions>;

  constructor(options: LifeLoopOptions = {}) {
    this.options = {
      intervalMs: options.intervalMs ?? 1000,
      onCycle: options.onCycle ?? (() => {}),
      onError: options.onError ?? (() => {})
    };
  }

  getState() {
    return { ...this.state };
  }

  async breathe() {
    if (!this.state.running) return;

    try {
      const phases: LifePhase[] = [
        "OBSERVE",
        "UNDERSTAND",
        "THINK",
        "PLAN",
        "ACT",
        "VERIFY",
        "LEARN"
      ];

      const phase = phases[this.state.cycle % phases.length];

      this.state.phase = phase;
      this.state.cycle += 1;
      this.state.lastHeartbeat = Date.now();
      this.state.lastError = undefined;

      await this.options.onCycle(this.getState());
    } catch (error) {
      this.state.phase = "RECOVER";
      this.state.lastError =
        error instanceof Error ? error.message : String(error);

      await this.options.onError(error, this.getState());
    }

    if (this.state.running) {
      this.timer = setTimeout(
        () => void this.breathe(),
        this.options.intervalMs
      );
    }
  }

  start() {
    if (this.state.running) return this.getState();

    this.state.running = true;
    this.state.phase = "OBSERVE";
    this.state.lastHeartbeat = Date.now();

    void this.breathe();

    return this.getState();
  }

  stop() {
    this.state.running = false;
    this.state.phase = "IDLE";

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }

    return this.getState();
  }
}
