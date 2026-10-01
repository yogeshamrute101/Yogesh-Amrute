import {
  SmartMasterPlan,
} from './SmartMasterTypes';

import {
  understandSmartMasterPrompt,
} from './SmartMasterUnderstanding';

function isDestructive(prompt: string): boolean {
  return /\b(delete|destroy|drop|wipe|reset|remove all)\b/i.test(
    prompt
  );
}

export function createSmartMasterPlan(
  prompt: string
): SmartMasterPlan {
  const intent = understandSmartMasterPrompt(prompt);

  const orderedActions = [
    'understand',
    'inspect',
    'plan',
    'create',
    'update',
    'connect',
    'classify',
    'execute',
    'verify',
    'recover',
    'explain',
  ] as const;

  const phases = [];

  for (const action of orderedActions) {
    if (!intent.actions.includes(action)) {
      continue;
    }

    for (const domain of intent.domains) {
      phases.push({
        id: `master_${phases.length + 1}`,
        action,
        domain,
        description:
          `${action} ${domain} for: ${intent.originalPrompt}`,
        verification: [
          'TypeScript validation',
          'Relevant integration validation',
        ],
      });
    }
  }

  return {
    id: `master_${Date.now()}`,
    intent,
    phases,
    safety: {
      destructive: isDestructive(prompt),
      approvalRequired: isDestructive(prompt),
    },
  };
}
