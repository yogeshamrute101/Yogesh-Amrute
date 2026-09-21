export type MovementDomain =
  | "PHYSICAL"
  | "HUMAN"
  | "ROBOT"
  | "OBJECT"
  | "FILE"
  | "DATA"
  | "NETWORK"
  | "RESOURCE"
  | "PROJECT"
  | "WORKFLOW"
  | "GAME"
  | "TIME"
  | "STATE"
  | "UNKNOWN";

export type MovementType =
  | "TRANSLATION"
  | "ROTATION"
  | "TRANSFER"
  | "MIGRATION"
  | "PROGRESS"
  | "REGRESSION"
  | "TRANSITION"
  | "REORDER"
  | "START"
  | "STOP"
  | "PAUSE"
  | "RESUME"
  | "UNKNOWN";

export interface Movement {
  id: string;
  domain: MovementDomain;
  type: MovementType;
  source?: string;
  destination?: string;
  fromState?: string;
  toState?: string;
  magnitude?: number;
  unit?: string;
  direction?: string;
  velocity?: number;
  timestamp: number;
  observed?: boolean;
}

export interface MovementAssessment {
  movementId: string;
  meaningfulChange: boolean;
  directionKnown: boolean;
  stateChanged: boolean;
  interpretation: string;
  confidence: number;
}

export class UniversalMovementEngine {
  understand(move: Movement): MovementAssessment {
    const stateChanged =
      move.fromState !== undefined &&
      move.toState !== undefined &&
      move.fromState !== move.toState;

    const directionKnown =
      Boolean(move.direction) ||
      Boolean(move.source && move.destination);

    const meaningfulChange =
      stateChanged ||
      directionKnown ||
      move.magnitude !== undefined ||
      move.type !== "UNKNOWN";

    return {
      movementId: move.id,
      meaningfulChange,
      directionKnown,
      stateChanged,
      interpretation: this.interpret(move, stateChanged),
      confidence: meaningfulChange ? 0.8 : 0.2,
    };
  }

  private interpret(
    move: Movement,
    stateChanged: boolean
  ): string {
    if (stateChanged) {
      return `State transition from ${move.fromState} to ${move.toState}.`;
    }

    if (move.source && move.destination) {
      return `Transfer from ${move.source} to ${move.destination}.`;
    }

    if (move.type === "PROGRESS") {
      return "Forward progress detected.";
    }

    if (move.type === "REGRESSION") {
      return "Backward or degraded movement detected.";
    }

    return `${move.type} movement detected in ${move.domain} domain.`;
  }
}
