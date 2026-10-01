import {
  SmartMasterPlan,
} from './SmartMasterTypes';

import {
  createSmartMasterPlan,
} from './SmartMasterPlanner';

export interface SmartMasterResult {
  success: boolean;
  plan: SmartMasterPlan;
  status:
    | 'planned'
    | 'approval-required'
    | 'ready-for-execution';
}

export function orchestrateSmartMaster(
  prompt: string
): SmartMasterResult {
  const plan = createSmartMasterPlan(prompt);

  return {
    success: true,
    plan,
    status: plan.safety.approvalRequired
      ? 'approval-required'
      : 'ready-for-execution',
  };
}
