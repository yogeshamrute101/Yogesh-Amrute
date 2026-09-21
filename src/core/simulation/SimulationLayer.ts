export type SimulationResult = {
  safeToExecute: boolean;
  predictedRisks: string[];
  assumptions: string[];
};

export class SimulationLayer {
  simulate(action: string): SimulationResult {
    return {
      safeToExecute: true,
      predictedRisks: [],
      assumptions: [`Simulation performed for: ${action}`]
    };
  }
}
