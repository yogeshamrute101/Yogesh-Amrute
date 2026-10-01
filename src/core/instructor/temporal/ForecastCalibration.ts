export interface ForecastRecord {
  id: string;
  createdAt: string;
  predictedRange: {
    low: number;
    high: number;
  };
  observedOutcome?: number;
  horizon: string;
}

export interface CalibrationResult {
  evaluated: number;
  covered: number;
  coverageRate: number;
  meanAbsoluteError?: number;
  recommendation: string;
}

export class ForecastCalibration {
  evaluate(records: ForecastRecord[]): CalibrationResult {
    const completed = records.filter(
      (record) => typeof record.observedOutcome === 'number',
    );

    if (!completed.length) {
      return {
        evaluated: 0,
        covered: 0,
        coverageRate: 0,
        recommendation:
          'Collect actual outcomes before changing forecast calibration.',
      };
    }

    let covered = 0;
    let absoluteError = 0;

    for (const record of completed) {
      const outcome = Number(record.observedOutcome);

      if (
        outcome >= record.predictedRange.low &&
        outcome <= record.predictedRange.high
      ) {
        covered += 1;
      }

      const midpoint =
        (record.predictedRange.low + record.predictedRange.high) / 2;

      absoluteError += Math.abs(midpoint - outcome);
    }

    const coverageRate = covered / completed.length;
    const meanAbsoluteError = absoluteError / completed.length;

    return {
      evaluated: completed.length,
      covered,
      coverageRate,
      meanAbsoluteError,
      recommendation:
        coverageRate < 0.5
          ? 'Forecast ranges need recalibration using additional evidence.'
          : 'Continue monitoring calibration and update ranges with new outcomes.',
    };
  }
}

export default ForecastCalibration;
