export type SolarOperation =
  | "RESOURCE_ASSESSMENT"
  | "PV_PLANNING"
  | "SOLAR_THERMAL"
  | "ENERGY_STORAGE"
  | "LOAD_MATCHING"
  | "EFFICIENCY_OPTIMIZATION"
  | "MONITORING"
  | "FAULT_DETECTION"
  | "ENERGY_FORECAST"
  | "SAFETY";

export interface SolarTask {
  operation: SolarOperation;
  location?: string;
  loadProfile?: Record<string, number>;
  availableAreaM2?: number;
  objective: string;
}

export interface SolarResult {
  accepted: boolean;
  operation: SolarOperation;
  recommendations: string[];
  measurementsRequired: string[];
  safetyRequirements: string[];
  physicalControlRequiresAuthorization: boolean;
}

export class SolarEnergyIntelligence {
  evaluate(task: SolarTask): SolarResult {
    return {
      accepted: true,
      operation: task.operation,
      recommendations: [
        "Assess available solar resource.",
        "Estimate photovoltaic or solar-thermal potential.",
        "Match generation with expected loads.",
        "Evaluate storage and energy-management requirements.",
        "Monitor performance and detect abnormal conditions.",
        "Optimize efficiency using measured data.",
      ],
      measurementsRequired: [
        "Solar irradiance",
        "Temperature",
        "System output",
        "Energy consumption",
        "Battery/storage state when applicable",
      ],
      safetyRequirements: [
        "Use certified electrical equipment.",
        "Apply appropriate electrical and fire-safety controls.",
        "Physical switching or grid-connected control requires authorization.",
      ],
      physicalControlRequiresAuthorization: true,
    };
  }
}
