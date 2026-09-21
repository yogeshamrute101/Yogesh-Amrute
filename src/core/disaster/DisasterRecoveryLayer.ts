export type RecoveryPlan = {
  id: string;
  target: string;
  backupAvailable: boolean;
  rollbackAvailable: boolean;
};

export class DisasterRecoveryLayer {
  evaluate(plan: RecoveryPlan) {
    return {
      ...plan,
      recoverable: plan.backupAvailable || plan.rollbackAvailable
    };
  }
}
