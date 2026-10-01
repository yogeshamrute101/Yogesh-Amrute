export type ExecutionCapability =
  | 'text'
  | 'image'
  | 'video'
  | 'audio'
  | 'food'
  | 'frontend'
  | 'backend'
  | 'data'
  | 'agent'
  | 'workflow'
  | 'integration'
  | 'testing'
  | 'recovery';

export type ExecutionStatus =
  | 'planned'
  | 'ready'
  | 'executing'
  | 'completed'
  | 'failed'
  | 'needs-review';

export interface InstructorIntent {
  goal: string;
  capability: ExecutionCapability;
  action: 'create' | 'update' | 'analyze' | 'execute' | 'classify' | 'repair';
  confidence: number;
  requiresExternalTool: boolean;
}

export interface ExecutionStep {
  id: string;
  capability: ExecutionCapability;
  action: string;
  description: string;
  required: boolean;
  completed: boolean;
}

export interface InstructorExecutionPlan {
  id: string;
  goal: string;
  intent: InstructorIntent;
  steps: ExecutionStep[];
  status: ExecutionStatus;
  verificationRequired: boolean;
  explanation: string;
}
