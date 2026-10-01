import { ExecutionPlan } from './ExecutionPlan';
import { planFullStackPrompt } from './FullStackPlanner';

export interface ExecutionResult {
  success: boolean;
  plan: ExecutionPlan;
  executedSteps: string[];
  skippedSteps: string[];
  errors: string[];
}

function isDestructivePrompt(prompt: string): boolean {
  return /\b(delete|remove|drop|destroy|wipe|reset)\b/i.test(prompt);
}

export function createExecutionPlan(
  prompt: string
): ExecutionPlan {
  const fullStackPlan = planFullStackPrompt(prompt);

  return {
    id: `exec_${Date.now()}`,
    prompt,
    steps: fullStackPlan.steps.map((step) => ({
      id: step.id,
      layer: step.layer,
      operation: step.operation,
      description: step.description,
      targetPaths: step.files,
      dependencies: [],
      verification: step.verification,
    })),
    safety: {
      destructive: isDestructivePrompt(prompt),
      requiresApproval: isDestructivePrompt(prompt),
    },
    status: 'ready',
  };
}

export function prepareExecution(
  prompt: string
): ExecutionResult {
  const plan = createExecutionPlan(prompt);

  return {
    success: true,
    plan,
    executedSteps: [],
    skippedSteps: plan.safety.requiresApproval
      ? plan.steps.map((step) => step.id)
      : [],
    errors: [],
  };
}
