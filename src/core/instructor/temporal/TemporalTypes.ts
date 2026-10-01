export type TemporalDirection = 'past' | 'present' | 'future';

export type EvidenceQuality =
  | 'verified'
  | 'strong'
  | 'moderate'
  | 'weak'
  | 'unknown';

export type ForecastHorizon =
  | 'hours'
  | 'days'
  | 'weeks'
  | 'months'
  | 'years'
  | 'long-term';

export type ScenarioType =
  | 'baseline'
  | 'upside'
  | 'downside'
  | 'disruptive';

export interface TemporalObservation {
  id: string;
  timestamp?: string;
  direction: TemporalDirection;
  statement: string;
  source?: string;
  evidenceQuality: EvidenceQuality;
  confidence: number;
}

export interface TemporalPattern {
  name: string;
  description: string;
  supportingObservationIds: string[];
  strength: number;
  limitations: string[];
}

export interface ForecastAssumption {
  statement: string;
  importance: number;
  uncertainty: number;
}

export interface ForecastScenario {
  id: string;
  type: ScenarioType;
  horizon: ForecastHorizon;
  outcome: string;
  probabilityRange: {
    low: number;
    high: number;
  };
  confidence: number;
  assumptions: ForecastAssumption[];
  evidence: string[];
  uncertainty: string[];
}

export interface TemporalForecast {
  question: string;
  generatedAt: string;
  horizon: ForecastHorizon;
  baseline: string;
  scenarios: ForecastScenario[];
  keyDrivers: string[];
  keyRisks: string[];
  missingInformation: string[];
  calibrationRequired: boolean;
  factualEvidenceRequired: boolean;
  disclaimer: string;
}

export interface TemporalContext {
  question: string;
  topic?: string;
  domain?: string;
  pastObservations?: TemporalObservation[];
  presentObservations?: TemporalObservation[];
  requestedHorizon?: ForecastHorizon;
  currentDate?: string;
}
