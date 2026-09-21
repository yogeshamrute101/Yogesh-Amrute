export interface ProcessStep {
  id: string;
  name: string;
  inputs: string[];
  outputs: string[];
  parameters: Record<string, number | string>;
  controls: string[];
  hazards: string[];
  qualityChecks: string[];
}

export interface ManufacturingPlan {
  productId: string;
  scale: "LAB" | "PILOT" | "PRODUCTION";
  steps: ProcessStep[];
  equipment: string[];
  qualityGates: string[];
  safetyGates: string[];
}

export class ProcessManufacturingPlanner {
  createPlan(
    productId: string,
    scale: ManufacturingPlan["scale"],
    steps: ProcessStep[],
    equipment: string[]
  ): ManufacturingPlan {
    return {
      productId,
      scale,
      steps,
      equipment,
      qualityGates: [
        "INPUT_CHECK",
        "IN_PROCESS_CHECK",
        "FINAL_QUALITY_CHECK"
      ],
      safetyGates: [
        "HAZARD_REVIEW",
        "PROCESS_SAFETY_REVIEW",
        "AUTHORIZATION_CHECK"
      ]
    };
  }
}
