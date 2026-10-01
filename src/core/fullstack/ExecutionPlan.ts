import { FullStackLayer, FullStackOperation } from './FullStackTypes';

export interface ExecutionStep {
  id: string;
  layer: FullStackLayer;
  operation: FullStackOperation;
  description: string;
  targetPaths: string[];
  dependencies: string[];
  verification: string[];
}

export interface ExecutionPlan {
  id: string;
  prompt: string;
  steps: ExecutionStep[];
  safety: {
    destructive: boolean;
    requiresApproval: boolean;
  };
  status: 'planned' | 'ready' | 'executed' | 'failed';
}
