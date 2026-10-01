import {
  ExecutionCapability,
  InstructorExecutionPlan,
  InstructorIntent, ExecutionStep } from './MasterExecutionTypes';

function detectCapability(prompt: string): ExecutionCapability {
  const p = prompt.toLowerCase();

  if (/(food|recipe|cook|cooking|meal|breakfast|lunch|dinner|pizza|cake|biryani)/.test(p)) {
    return 'food';
  }

  if (/(video|reel|movie|clip|animation)/.test(p)) {
    return 'video';
  }

  if (/(image|photo|picture|poster|thumbnail)/.test(p)) {
    return 'image';
  }

  if (/(audio|voice|music|song|sound)/.test(p)) {
    return 'audio';
  }

  if (/(app|screen|ui|frontend|component)/.test(p)) {
    return 'frontend';
  }

  if (/(backend|api|server|database|data)/.test(p)) {
    return 'backend';
  }

  if (/(agent|assistant|copilot|autonomous)/.test(p)) {
    return 'agent';
  }

  if (/(workflow|automation|flow|pipeline)/.test(p)) {
    return 'workflow';
  }

  if (/(test|verify|check|audit)/.test(p)) {
    return 'testing';
  }

  if (/(repair|fix|error|bug)/.test(p)) {
    return 'recovery';
  }

  return 'text';
}

function detectAction(prompt: string): InstructorIntent['action'] {
  const p = prompt.toLowerCase();

  if (/(fix|repair|resolve|debug)/.test(p)) return 'repair';
  if (/(analyze|understand|classify)/.test(p)) return 'analyze';
  if (/(update|modify|change|improve)/.test(p)) return 'update';
  if (/(execute|run|do|make|create|build|generate)/.test(p)) return 'execute';

  return 'create';
}

export function understandInstructorRequest(goal: string): InstructorIntent {
  const capability = detectCapability(goal);
  const action = detectAction(goal);

  return {
    goal,
    capability,
    action,
    confidence: capability === 'text' ? 0.55 : 0.9,
    requiresExternalTool: [
      'image',
      'video',
      'audio',
      'food',
    ].includes(capability),
  };
}

export function createExecutionPlan(goal: string): InstructorExecutionPlan {
  const intent = understandInstructorRequest(goal);

  const steps: ExecutionStep[] = [
    {
      id: 'understand',
      capability: intent.capability,
      action: 'understand',
      description: 'Understand exactly what the user wants.',
      required: true,
      completed: false,
    },
    {
      id: 'select-capability',
      capability: intent.capability,
      action: 'select-capability',
      description: 'Select the correct built-in capability, agent, or external tool.',
      required: true,
      completed: false,
    },
    {
      id: 'execute',
      capability: intent.capability,
      action: intent.action,
      description: 'Actually perform the requested task instead of only describing a plan.',
      required: true,
      completed: false,
    },
    {
      id: 'verify',
      capability: 'testing',
      action: 'verify',
      description: 'Verify that the requested result was actually produced.',
      required: true,
      completed: false,
    },
    {
      id: 'recover',
      capability: 'recovery',
      action: 'recover',
      description: 'Recover safely if execution fails.',
      required: false,
      completed: false,
    },
  ];

  return {
    id: `master_exec_${Date.now()}`,
    goal,
    intent,
    steps,
    status: 'ready',
    verificationRequired: true,
    explanation:
      'The instructor must execute the requested capability and verify the actual result. Planning alone is not considered completion.',
  };
}
