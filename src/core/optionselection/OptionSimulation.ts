import { DecisionOption } from "./BestOptionEngine";

export interface SimulationResult {
  optionId: string;
  expectedBenefit: number;
  expectedRisk: number;
  uncertainty: number;
}

export class OptionSimulation {
  simulate(option: DecisionOption): SimulationResult {
    return {
      optionId: option.id,
      expectedBenefit: option.expectedBenefit,
      expectedRisk: option.risk,
      uncertainty: Math.max(
        0,
        1 - (option.evidence + option.experience) / 2
      ),
    };
  }
}
