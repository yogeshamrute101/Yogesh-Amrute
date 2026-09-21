export interface SimulationRequest {
  id: string;
  environment: string;
  action: string;
  parameters?: Record<string, unknown>;
}

export interface SimulationResult {
  requestId: string;
  safeToProceed: boolean;
  risks: string[];
  notes: string[];
}

export class PhysicalSimulationLayer {
  simulate(request: SimulationRequest): SimulationResult {
    return {
      requestId: request.id,
      safeToProceed: false,
      risks: [
        "Simulation adapter is not connected to a physics engine yet.",
      ],
      notes: [
        "Real hardware execution must not be assumed from this placeholder.",
      ],
    };
  }
}

export const simulationLayer = new PhysicalSimulationLayer();
