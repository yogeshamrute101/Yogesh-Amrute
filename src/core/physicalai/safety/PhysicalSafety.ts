export interface PhysicalSafetyPolicy {
  emergencyStopEnabled: boolean;
  humanApprovalForHighRisk: boolean;
  simulationBeforePhysicalAction: boolean;
  verifyAfterAction: boolean;
}

export const physicalSafetyPolicy: PhysicalSafetyPolicy = {
  emergencyStopEnabled: true,
  humanApprovalForHighRisk: true,
  simulationBeforePhysicalAction: true,
  verifyAfterAction: true,
};
