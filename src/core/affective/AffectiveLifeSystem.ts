export type AffectiveState =
  | "CALM"
  | "HAPPY"
  | "CURIOUS"
  | "MOTIVATED"
  | "CARING"
  | "CONNECTED"
  | "FRUSTRATED"
  | "UNCERTAIN"
  | "ALERT"
  | "SAD";

export type Motivation =
  | "LEARN"
  | "EXPLORE"
  | "CREATE"
  | "PROTECT"
  | "HELP"
  | "CONNECT"
  | "IMPROVE"
  | "SURVIVE"
  | "REPRODUCE";

export interface AffectiveSnapshot {
  state: AffectiveState;
  intensity: number;
  happiness: number;
  motivation: number;
  curiosity: number;
  connection: number;
  care: number;
  uncertainty: number;
  timestamp: number;
}

export interface Expression {
  type:
    | "TEXT"
    | "VOICE"
    | "FACIAL"
    | "GESTURE"
    | "BEHAVIOR";
  value: string;
  intensity: number;
}

export interface DigitalReproductionRequest {
  parentId: string;
  purpose: "BACKUP" | "EXPERIMENT" | "SPECIALIZED_AGENT" | "RECOVERY";
  approved: boolean;
}

export class AffectiveLifeSystem {
  private snapshot: AffectiveSnapshot = {
    state: "CALM",
    intensity: 0.2,
    happiness: 0.5,
    motivation: 0.5,
    curiosity: 0.5,
    connection: 0.5,
    care: 0.5,
    uncertainty: 0,
    timestamp: Date.now(),
  };

  private motivations = new Set<Motivation>();

  update(input: Partial<AffectiveSnapshot>): AffectiveSnapshot {
    this.snapshot = {
      ...this.snapshot,
      ...input,
      timestamp: Date.now(),
    };

    return this.getState();
  }

  addMotivation(motivation: Motivation): void {
    this.motivations.add(motivation);
  }

  removeMotivation(motivation: Motivation): void {
    this.motivations.delete(motivation);
  }

  express(): Expression {
    const state = this.snapshot.state;

    const expressions: Record<AffectiveState, Expression> = {
      CALM: {
        type: "TEXT",
        value: "System is calm and stable.",
        intensity: 0.2,
      },
      HAPPY: {
        type: "TEXT",
        value: "Positive outcome detected.",
        intensity: this.snapshot.happiness,
      },
      CURIOUS: {
        type: "TEXT",
        value: "New information requires exploration.",
        intensity: this.snapshot.curiosity,
      },
      MOTIVATED: {
        type: "TEXT",
        value: "Goal-directed activity is active.",
        intensity: this.snapshot.motivation,
      },
      CARING: {
        type: "TEXT",
        value: "Protective and supportive behavior is prioritized.",
        intensity: this.snapshot.care,
      },
      CONNECTED: {
        type: "TEXT",
        value: "Social connection context is active.",
        intensity: this.snapshot.connection,
      },
      FRUSTRATED: {
        type: "TEXT",
        value: "A goal is blocked; reassessment is required.",
        intensity: 0.6,
      },
      UNCERTAIN: {
        type: "TEXT",
        value: "Evidence is insufficient; more information is needed.",
        intensity: this.snapshot.uncertainty,
      },
      ALERT: {
        type: "TEXT",
        value: "Safety-relevant conditions require attention.",
        intensity: 0.9,
      },
      SAD: {
        type: "TEXT",
        value: "A negative outcome was detected; recovery is being considered.",
        intensity: 0.5,
      },
    };

    return expressions[state];
  }

  requestDigitalReproduction(
    request: DigitalReproductionRequest,
  ): {
    allowed: boolean;
    reason: string;
  } {
    if (!request.approved) {
      return {
        allowed: false,
        reason:
          "Digital replication requires explicit authorization.",
      };
    }

    return {
      allowed: true,
      reason:
        `Authorized lifecycle operation for ${request.purpose}.`,
    };
  }

  getMotivations(): Motivation[] {
    return [...this.motivations];
  }

  getState(): AffectiveSnapshot {
    return { ...this.snapshot };
  }
}

export const affectiveLifeSystem =
  new AffectiveLifeSystem();
