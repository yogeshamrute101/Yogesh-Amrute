import { HistoricalExperienceEngine } from "./HistoricalExperienceEngine";
import { ProbabilityForecastEngine } from "./ProbabilityForecastEngine";
import { ScenarioFutureEngine } from "./ScenarioFutureEngine";
import { WorldConditionMatrix } from "./WorldConditionMatrix";

export class FutureIntelligenceCenter {
  readonly history = new HistoricalExperienceEngine();
  readonly conditions = new WorldConditionMatrix();
  readonly probability = new ProbabilityForecastEngine();
  readonly scenarios = new ScenarioFutureEngine();

  analyzeFuture(
    domain: string,
    currentConditions: Record<string, unknown>,
    scenarioLabels: string[]
  ) {
    const patterns = this.history.findPatterns(domain);

    const historicalPatterns = patterns.flatMap(pattern =>
      pattern.outcomes
    );

    const probabilityForecast = this.probability.forecast({
      domain,
      currentConditions,
      historicalPatterns,
      scenarios: scenarioLabels
    });

    const scenarioFutures = this.scenarios.generate(
      domain,
      currentConditions
    );

    return {
      domain,
      generatedAt: Date.now(),
      probabilityForecast,
      scenarioFutures,
      conditionConfidence: this.conditions.averageConfidence(),
      warning:
        "Forecasts are probabilistic estimates and must not be treated as certain future facts."
    };
  }
}
