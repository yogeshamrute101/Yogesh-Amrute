export type FullStackLayer =
  | 'frontend'
  | 'backend'
  | 'data'
  | 'integration'
  | 'unknown';

export type FullStackOperation =
  | 'inspect'
  | 'create'
  | 'update'
  | 'delete'
  | 'connect'
  | 'migrate'
  | 'test'
  | 'explain';

export interface FullStackIntent {
  goal: string;
  layers: FullStackLayer[];
  operations: FullStackOperation[];
  entities: string[];
  files: string[];
  routes: string[];
  dataModels: string[];
  dependencies: string[];
  explanation: string;
}

export interface FullStackPlan {
  intent: FullStackIntent;
  steps: Array<{
    id: string;
    layer: FullStackLayer;
    operation: FullStackOperation;
    description: string;
    files: string[];
    verification: string[];
  }>;
  requiresConfirmation: boolean;
}
