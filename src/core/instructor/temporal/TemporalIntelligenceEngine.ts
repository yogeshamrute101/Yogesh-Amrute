import PastReconstructionEngine from './PastReconstructionEngine';
import FutureForecastEngine from './FutureForecastEngine';
import { TemporalContext, TemporalForecast } from './TemporalTypes';

export class TemporalIntelligenceEngine {
  private readonly past = new PastReconstructionEngine();
  private readonly future = new FutureForecastEngine();

  analyzePast(context: TemporalContext) {
    return this.past.reconstruct(context);
  }

  forecastFuture(context: TemporalContext): TemporalForecast {
    const reconstruction = this.past.reconstruct(context);

    return this.future.forecast({
      ...context,
      pastObservations: reconstruction.timeline.filter(
        (item) => item.direction === 'past',
      ),
      presentObservations: reconstruction.timeline.filter(
        (item) => item.direction === 'present',
      ),
    });
  }

  analyze(context: TemporalContext) {
    const past = this.analyzePast(context);
    const future = this.forecastFuture(context);

    return {
      past,
      future,
      temporalModel: {
        past: 'evidence reconstruction',
        present: 'current-state synthesis',
        future: 'scenario forecasting',
      },
    };
  }
}

export default TemporalIntelligenceEngine;
