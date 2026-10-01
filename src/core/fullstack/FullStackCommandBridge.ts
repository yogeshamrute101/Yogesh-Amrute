import {
  FullStackPlan,
  FullStackLayer,
  FullStackOperation,
} from './FullStackTypes';

import { planFullStackPrompt } from './FullStackPlanner';

export interface FullStackCommandResult {
  success: boolean;
  prompt: string;
  plan: FullStackPlan;
  summary: {
    layers: FullStackLayer[];
    operations: FullStackOperation[];
    stepCount: number;
  };
}

export function analyzeFullStackCommand(
  prompt: string
): FullStackCommandResult {
  const plan = planFullStackPrompt(prompt);

  return {
    success: true,
    prompt,
    plan,
    summary: {
      layers: plan.intent.layers,
      operations: plan.intent.operations,
      stepCount: plan.steps.length,
    },
  };
}
