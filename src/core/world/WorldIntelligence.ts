export type WorldDomain =
  | "GEOGRAPHY"
  | "ENVIRONMENT"
  | "INFRASTRUCTURE"
  | "ENERGY"
  | "WATER"
  | "TRANSPORT"
  | "ECOSYSTEM"
  | "ANIMAL"
  | "SCIENCE"
  | "SPACE"
  | "TECHNOLOGY"
  | "SOFTWARE"
  | "INDUSTRY"
  | "SOCIETY"
  | "HUMAN"
  | "UNKNOWN";

export type KnowledgeType =
  | "OBSERVED"
  | "MEASURED"
  | "DATABASE"
  | "RESEARCH"
  | "MODEL"
  | "INFERENCE"
  | "HYPOTHESIS"
  | "UNKNOWN";

export type SituationLevel =
  | "NORMAL"
  | "CHANGING"
  | "UNCERTAIN"
  | "RISK"
  | "CRITICAL";

export interface WorldEntity {
  id: string;
  name: string;
  domain: WorldDomain;
  description?: string;
  location?: string;
  properties?: Record<string, unknown>;
  source?: string;
  knowledgeType: KnowledgeType;
  confidence: number;
  observedAt: number;
  updatedAt: number;
}

export interface WorldObservation {
  id: string;
  entityId?: string;
  domain: WorldDomain;
  signal: string;
  value?: unknown;
  source?: string;
  confidence: number;
  timestamp: number;
}

export interface SituationAssessment {
  level: SituationLevel;
  context: string[];
  risks: string[];
  opportunities: string[];
  uncertainties: string[];
  consequences: string[];
  recommendedMode:
    | "OBSERVE"
    | "ANALYZE"
    | "PLAN"
    | "SAFE_MODE"
    | "ESCALATE";
  confidence: number;
}

export interface WorldState {
  entities: WorldEntity[];
  observations: WorldObservation[];
  situation?: SituationAssessment;
  lastUpdated: number;
}

export class WorldIntelligence {
  private state: WorldState = {
    entities: [],
    observations: [],
    lastUpdated: Date.now(),
  };

  registerEntity(entity: WorldEntity): WorldState {
    const index = this.state.entities.findIndex(
      (item) => item.id === entity.id,
    );

    if (index >= 0) {
      this.state.entities[index] = {
        ...this.state.entities[index],
        ...entity,
        updatedAt: Date.now(),
      };
    } else {
      this.state.entities.push({
        ...entity,
        updatedAt: Date.now(),
      });
    }

    this.state.lastUpdated = Date.now();
    return this.getState();
  }

  observe(observation: WorldObservation): WorldState {
    this.state.observations.push(observation);
    this.state.observations = this.state.observations.slice(-1000);
    this.state.lastUpdated = Date.now();

    return this.getState();
  }

  assessSituation(): SituationAssessment {
    const observations = this.state.observations;
    const risks: string[] = [];
    const opportunities: string[] = [];
    const uncertainties: string[] = [];
    const context: string[] = [];

    let level: SituationLevel = "NORMAL";
    let confidence = 0;

    for (const observation of observations.slice(-100)) {
      confidence = Math.max(confidence, observation.confidence);

      const signal = observation.signal.toLowerCase();

      context.push(
        `${observation.domain}: ${observation.signal}`,
      );

      if (
        signal.includes("critical") ||
        signal.includes("catastrophe") ||
        signal.includes("emergency")
      ) {
        level = "CRITICAL";
        risks.push(observation.signal);
      } else if (
        signal.includes("danger") ||
        signal.includes("failure") ||
        signal.includes("unsafe") ||
        signal.includes("threat")
      ) {
        if (level !== "CRITICAL") level = "RISK";
        risks.push(observation.signal);
      } else if (
        signal.includes("change") ||
        signal.includes("anomaly") ||
        signal.includes("uncertain")
      ) {
        if (level === "NORMAL") level = "CHANGING";
        uncertainties.push(observation.signal);
      } else if (
        signal.includes("opportunity") ||
        signal.includes("improvement")
      ) {
        opportunities.push(observation.signal);
      }
    }

    if (confidence < 0.4 && level === "NORMAL") {
      level = "UNCERTAIN";
      uncertainties.push(
        "Available evidence is insufficient for a strong conclusion.",
      );
    }

    const recommendedMode =
      level === "CRITICAL"
        ? "ESCALATE"
        : level === "RISK"
          ? "SAFE_MODE"
          : level === "UNCERTAIN"
            ? "ANALYZE"
            : level === "CHANGING"
              ? "PLAN"
              : "OBSERVE";

    this.state.situation = {
      level,
      context: context.slice(-100),
      risks: risks.slice(-50),
      opportunities: opportunities.slice(-50),
      uncertainties: uncertainties.slice(-50),
      consequences: [],
      recommendedMode,
      confidence,
    };

    this.state.lastUpdated = Date.now();

    return this.state.situation;
  }

  maturityCheck(): {
    readyForAction: boolean;
    reasons: string[];
    requiresMoreEvidence: boolean;
  } {
    const situation = this.state.situation ?? this.assessSituation();

    const reasons: string[] = [];
    let readyForAction = true;
    let requiresMoreEvidence = false;

    if (situation.level === "UNCERTAIN") {
      readyForAction = false;
      requiresMoreEvidence = true;
      reasons.push("Situation is uncertain.");
    }

    if (situation.confidence < 0.5) {
      readyForAction = false;
      requiresMoreEvidence = true;
      reasons.push("Confidence is below action threshold.");
    }

    if (situation.risks.length > 0) {
      reasons.push("Potential risks require evaluation.");
    }

    if (situation.uncertainties.length > 0) {
      reasons.push("Unresolved uncertainty exists.");
    }

    if (situation.level === "CRITICAL") {
      readyForAction = false;
      reasons.push(
        "Critical situation requires controlled escalation and authorization.",
      );
    }

    return {
      readyForAction,
      reasons,
      requiresMoreEvidence,
    };
  }

  queryWorld(query: {
    domain?: WorldDomain;
    location?: string;
    text?: string;
  }): WorldEntity[] {
    const text = query.text?.toLowerCase();

    return this.state.entities.filter((entity) => {
      const domainMatch =
        !query.domain || entity.domain === query.domain;

      const locationMatch =
        !query.location ||
        entity.location
          ?.toLowerCase()
          .includes(query.location.toLowerCase());

      const textMatch =
        !text ||
        entity.name.toLowerCase().includes(text) ||
        entity.description?.toLowerCase().includes(text);

      return domainMatch && locationMatch && textMatch;
    });
  }

  updateWorldModel(): WorldState {
    this.assessSituation();
    this.state.lastUpdated = Date.now();
    return this.getState();
  }

  getState(): WorldState {
    return {
      entities: [...this.state.entities],
      observations: [...this.state.observations],
      situation: this.state.situation,
      lastUpdated: this.state.lastUpdated,
    };
  }
}

export const worldIntelligence = new WorldIntelligence();
