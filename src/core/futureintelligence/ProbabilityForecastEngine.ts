/**
 * Probability Forecast Engine
 *
 * Produces probability estimates from evidence and scenarios.
 * Probabilities are estimates, not certainty.
 */

export interface ForecastScenario {
  id: string;
  label: string;
  probability: number;
  evidenceCount: number;
  uncertainty: number;
  assumptions: string[];
}

export interface ForecastRequest {
  domain: string;
  currentConditions: Record<string, unknown>;
  historicalPatterns: Array<{
    outcome: string;
    observations: number;
  }>;
  scenarios: string[];
}

export class ProbabilityForecastEngine {
  forecast(request: ForecastRequest): ForecastScenario[] {
    const total =
      request.historicalPatterns.reduce(
        (sum, item) => sum + item.observations,
        0
      );

    if (total === 0) {
      return request.scenarios.map((label, index) => ({
        id: `scenario-${index}`,
        label,
        probability: 1 / Math.max(1, request.scenarios.length),
        evidenceCount: 0,
        uncertainty: 1,
        assumptions: ["Insufficient historical evidence"]
      }));
    }

    const historical = new Map(
      request.historicalPatterns.map(x => [x.outcome, x.observations])
    );

    return request.scenarios.map((label, index) => {
      const count = historical.get(label) ?? 0;
      const probability = count / total;

      return {
        id: `scenario-${index}`,
        label,
        probability,
        evidenceCount: count,
        uncertainty: count === 0 ? 1 : Math.max(0.05, 1 - count / total),
        assumptions: [
          "Historical relationships may change",
          "Current conditions may differ from historical conditions",
          "Unknown variables may affect the outcome"
        ]
      };
    });
  }
}
