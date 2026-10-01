export type ImaginationMode =
  | 'disabled'
  | 'instruction-following'
  | 'autonomous'
  | 'mixed';

export type ImaginationKind =
  | 'question'
  | 'idea'
  | 'scenario'
  | 'explanation'
  | 'simulation'
  | 'learning-path'
  | 'creative-connection'
  | 'next-step';

export interface InstructorContext {
  userMessage?: string;
  conversationSummary?: string;
  recentMessages?: string[];
  topic?: string;
  mode?: string;
  domain?: string;
  userGoal?: string;
  previousTopics?: string[];
  lastInstructorAction?: string;
}

export interface ImaginationCandidate {
  kind: ImaginationKind;
  content: string;
  rationale: string;
  relevance: number;
  novelty: number;
  learningValue: number;
  safety: number;
  repetitionPenalty: number;
  requiresResearch: boolean;
  isFactualClaim: boolean;
  isHypothetical: boolean;
}

export interface AutonomousInitiative {
  active: boolean;
  mode: ImaginationMode;
  kind: ImaginationKind;
  content: string;
  rationale: string;
  isImagined: boolean;
  requiresResearch: boolean;
  researchRequiredBeforeFactClaim: boolean;
  externalActionAllowed: false;
}

export interface ImaginationPolicy {
  allowWhenInstructionMissing: boolean;
  allowExternalActions: boolean;
  allowUnverifiedCurrentFacts: boolean;
  allowInfiniteSelfTalk: boolean;
  maxAutonomousTurns: number;
  cooldownTurns: number;
}
