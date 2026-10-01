export type MasterDomain =
  | 'prompt'
  | 'frontend'
  | 'backend'
  | 'data'
  | 'video'
  | 'image'
  | 'text'
  | 'content'
  | 'agent'
  | 'workflow'
  | 'integration'
  | 'testing'
  | 'recovery'
  | 'unknown';

export type MasterAction =
  | 'understand'
  | 'inspect'
  | 'plan'
  | 'create'
  | 'update'
  | 'connect'
  | 'classify'
  | 'execute'
  | 'verify'
  | 'recover'
  | 'explain';

export interface SmartMasterIntent {
  originalPrompt: string;
  domains: MasterDomain[];
  actions: MasterAction[];
  requiresFrontend: boolean;
  requiresBackend: boolean;
  requiresData: boolean;
  requiresMediaUnderstanding: boolean;
  requiresAgentExecution: boolean;
  requiresVerification: boolean;
  explanation: string;
}

export interface SmartMasterPlan {
  id: string;
  intent: SmartMasterIntent;
  phases: Array<{
    id: string;
    action: MasterAction;
    domain: MasterDomain;
    description: string;
    verification: string[];
  }>;
  safety: {
    destructive: boolean;
    approvalRequired: boolean;
  };
}
