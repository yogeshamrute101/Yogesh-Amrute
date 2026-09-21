export type UniversalLoopStage =
  | "OBSERVE"
  | "UNDERSTAND"
  | "REMEMBER"
  | "RESEARCH"
  | "REASON"
  | "PLAN"
  | "EXECUTE"
  | "MONITOR"
  | "VERIFY"
  | "CORRECT"
  | "LEARN"
  | "STORE"
  | "ADAPT"
  | "COMPLETE"
  | "PAUSE"
  | "SAFE_MODE";

export interface UniversalLoopState {
  taskId: string;
  stage: UniversalLoopStage;
  iteration: number;
  maxIterations: number;
  verified: boolean;
  completed: boolean;
  paused: boolean;
  safeMode: boolean;
  error?: string;
  lastResult?: unknown;
}

export interface UniversalLoopHooks {
  observe?: (state: UniversalLoopState) => Promise<unknown> | unknown;
  understand?: (state: UniversalLoopState) => Promise<unknown> | unknown;
  remember?: (state: UniversalLoopState) => Promise<unknown> | unknown;
  research?: (state: UniversalLoopState) => Promise<unknown> | unknown;
  reason?: (state: UniversalLoopState) => Promise<unknown> | unknown;
  plan?: (state: UniversalLoopState) => Promise<unknown> | unknown;
  execute?: (state: UniversalLoopState) => Promise<unknown> | unknown;
  monitor?: (state: UniversalLoopState) => Promise<unknown> | unknown;
  verify?: (state: UniversalLoopState) => Promise<boolean> | boolean;
  correct?: (state: UniversalLoopState) => Promise<unknown> | unknown;
  learn?: (state: UniversalLoopState) => Promise<unknown> | unknown;
  store?: (state: UniversalLoopState) => Promise<unknown> | unknown;
  adapt?: (state: UniversalLoopState) => Promise<unknown> | unknown;
}

const stages: UniversalLoopStage[] = [
  "OBSERVE",
  "UNDERSTAND",
  "REMEMBER",
  "RESEARCH",
  "REASON",
  "PLAN",
  "EXECUTE",
  "MONITOR",
  "VERIFY",
  "CORRECT",
  "LEARN",
  "STORE",
  "ADAPT",
];

export class UniversalEverythingLoop {
  async run(
    initial: UniversalLoopState,
    hooks: UniversalLoopHooks
  ): Promise<UniversalLoopState> {
    let state = { ...initial };

    while (
      !state.completed &&
      !state.paused &&
      !state.safeMode &&
      state.iteration < state.maxIterations
    ) {
      try {
        for (const stage of stages) {
          if (state.paused || state.safeMode) break;

          state = {
            ...state,
            stage,
          };

          const hook = hooks[stage.toLowerCase() as keyof UniversalLoopHooks];

          if (hook) {
            const result = await hook(state);

            if (result !== undefined) {
              state = {
                ...state,
                lastResult: result,
              };
            }
          }

          if (stage === "VERIFY") {
            const verified = hooks.verify
              ? await hooks.verify(state)
              : false;

            state = {
              ...state,
              verified,
            };

            if (!verified) {
              state = {
                ...state,
                stage: "CORRECT",
              };

              if (hooks.correct) {
                const result = await hooks.correct(state);
                state = {
                  ...state,
                  lastResult: result,
                };
              }

              break;
            }
          }
        }

        if (state.verified) {
          state = {
            ...state,
            stage: "COMPLETE",
            completed: true,
          };
        }

        state = {
          ...state,
          iteration: state.iteration + 1,
        };
      } catch (error) {
        state = {
          ...state,
          stage: "SAFE_MODE",
          safeMode: true,
          error: error instanceof Error ? error.message : String(error),
        };
      }
    }

    return state;
  }
}
