export type ScalingAction =
  | "EXPAND"
  | "CONTRACT"
  | "HORIZONTAL_SCALE"
  | "VERTICAL_SCALE"
  | "DECOMPOSE"
  | "MERGE"
  | "QUEUE"
  | "PAUSE"
  | "RESUME";

export interface ScalingRequest {
  currentLoad: number;
  capacity: number;
  availableResources: Record<string, number>;
  requestedScale: number;
}

export class DynamicScalingEngine {
  decide(request: ScalingRequest): ScalingAction {
    if (request.currentLoad > request.capacity) return "EXPAND";
    if (request.currentLoad < request.capacity * 0.25) return "CONTRACT";
    if (request.requestedScale > 1) return "HORIZONTAL_SCALE";
    return "RESUME";
  }
}
