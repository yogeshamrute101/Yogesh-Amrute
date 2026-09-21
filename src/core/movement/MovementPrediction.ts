import { Movement } from "./UniversalMovementEngine";

export interface MovementPrediction {
  possibleNextStates: string[];
  confidence: number;
  basis: string[];
}

export class MovementPredictionEngine {
  predict(
    history: Movement[],
    currentState?: string
  ): MovementPrediction {
    const transitions = history.filter(
      x =>
        x.fromState === currentState &&
        x.toState !== undefined
    );

    const states = [
      ...new Set(
        transitions
          .map(x => x.toState)
          .filter((x): x is string => Boolean(x))
      ),
    ];

    return {
      possibleNextStates: states,
      confidence: states.length ? 0.7 : 0,
      basis: [
        "Historical movement transitions",
        "Current state",
      ],
    };
  }
}
