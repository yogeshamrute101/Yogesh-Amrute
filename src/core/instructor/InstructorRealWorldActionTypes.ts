export type RealWorldActionKind =
  | 'research'
  | 'plan'
  | 'tool'
  | 'workflow'
  | 'generation'
  | 'editor'
  | 'communication'
  | 'deployment'
  | 'none';

export type ActionRisk =
  | 'read-only'
  | 'reversible'
  | 'external-side-effect'
  | 'high-impact';

export interface RealWorldAction {
  id: string;
  kind: RealWorldActionKind;
  name: string;
  description: string;
  risk: ActionRisk;
  requiresPermission: boolean;
  requiresResearch: boolean;
  requiresVerification: boolean;
  reversible: boolean;
  payload?: Record<string, unknown>;
}

export interface RealWorldActionResult {
  actionId: string;
  status: 'planned' | 'awaiting-permission' | 'executed' | 'verified' | 'failed' | 'recovered';
  output?: unknown;
  error?: string;
  verification?: {
    passed: boolean;
    evidence?: string[];
  };
}

export interface ImaginationExecutionContext {
  userInstruction?: string;
  conversationSummary?: string;
  topic?: string;
  domain?: string;
  imaginedIdea: string;
  requestedOutcome?: string;
  allowExternalSideEffects?: boolean;
}

export interface RealWorldExecutionPolicy {
  allowReadOnlyAutonomy: boolean;
  allowReversibleAutonomy: boolean;
  requirePermissionForExternalSideEffects: boolean;
  requireVerificationAfterExecution: boolean;
  allowArbitraryShell: boolean;
  allowUnboundedLoops: boolean;
  maxActionsPerInitiative: number;
}
