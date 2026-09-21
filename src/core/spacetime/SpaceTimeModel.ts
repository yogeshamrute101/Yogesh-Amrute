export type ScaleDimension =
  | "SPACE"
  | "TIME"
  | "COMPUTE"
  | "STORAGE"
  | "NETWORK"
  | "WORKFORCE"
  | "MATERIAL"
  | "BUDGET";

export interface SpaceTimeState {
  spaceAvailable: number;
  timeAvailableMs: number;
  resources: Record<string, number>;
  constraints: string[];
}

export class SpaceTimeModel {
  evaluate(state: SpaceTimeState) {
    return {
      scalable: state.spaceAvailable > 0 && state.timeAvailableMs > 0,
      space: state.spaceAvailable,
      timeMs: state.timeAvailableMs,
      resources: { ...state.resources },
      constraints: [...state.constraints],
    };
  }
}
