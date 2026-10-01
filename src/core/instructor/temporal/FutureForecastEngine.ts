import {
  ForecastAssumption,
  ForecastHorizon,
  ForecastScenario,
  TemporalContext,
  TemporalForecast,
  TemporalPattern,
} from './TemporalTypes';

const clamp = (value: number, min = 0, max = 1): number =>
  Math.max(min, Math.min(max, value));

const normalize = (value: string): string =>
  value.trim().toLowerCase();

const detectPatterns = (context: TemporalContext): TemporalPattern[] => {
  const observations = [
    ...(context.pastObservations ?? []),
    ...(context.presentObservations ?? []),
  ];

  if (observations.length < 2) return [];

  const text = observations.map((item) => normalize(item.statement)).join(' ');

  const patterns: TemporalPattern[] = [];

  if (
    /\b(increas|growth|grow|rise|rising|upward|expand|expanding|adoption)\b/.test(
      text,
    )
  ) {
    patterns.push({
      name: 'positive trend signal',
      description:
        'Available observations contain evidence of growth or increasing activity.',
      supportingObservationIds: observations.map((item) => item.id),
      strength: 0.65,
      limitations: ['Trend continuation is not guaranteed.'],
    });
  }

  if (
    /\b(decreas|decline|fall|falling|drop|dropping|shrink|shrinking)\b/.test(
      text,
    )
  ) {
    patterns.push({
      name: 'negative trend signal',
      description:
        'Available observations contain evidence of declining activity.',
      supportingObservationIds: observations.map((item) => item.id),
      strength: 0.65,
      limitations: ['Declines can reverse when conditions change.'],
    });
  }

  if (
    /\b(risk|uncertain|uncertainty|volatil|disrupt|shock|crisis)\b/.test(text)
  ) {
    patterns.push({
      name: 'uncertainty signal',
      description:
        'Available observations contain signals that can increase forecast uncertainty.',
      supportingObservationIds: observations.map((item) => item.id),
      strength: 0.75,
      limitations: ['Risk signals do not determine a specific outcome.'],
    });
  }

  return patterns;
};

const horizonMultiplier = (horizon: ForecastHorizon): number => {
  switch (horizon) {
    case 'hours':
      return 0.95;
    case 'days':
      return 0.9;
    case 'weeks':
      return 0.82;
    case 'months':
      return 0.72;
    case 'years':
      return 0.55;
    case 'long-term':
      return 0.4;
    default:
      return 0.7;
  }
};

export class FutureForecastEngine {
  forecast(context: TemporalContext): TemporalForecast {
    const horizon = context.requestedHorizon ?? 'months';
    const observations = [
      ...(context.pastObservations ?? []),
      ...(context.presentObservations ?? []),
    ];

    const patterns = detectPatterns(context);
    const multiplier = horizonMultiplier(horizon);

    const evidenceStrength =
      observations.length === 0
        ? 0
        : observations.reduce(
            (sum, item) => sum + clamp(item.confidence),
            0,
          ) / observations.length;

    const patternStrength =
      patterns.length === 0
        ? 0
        : patterns.reduce((sum, item) => sum + item.strength, 0) /
          patterns.length;

    const baseConfidence = clamp(
      evidenceStrength * 0.65 +
        patternStrength * 0.35,
    );

    const confidence = clamp(baseConfidence * multiplier);

    const assumptions: ForecastAssumption[] = [
      {
        statement: 'Major external conditions do not change unexpectedly.',
        importance: 0.9,
        uncertainty: 0.55,
      },
      {
        statement: 'Observed trends contain useful signal for the requested horizon.',
        importance: 0.85,
        uncertainty: 0.5,
      },
    ];

    const evidence = observations
      .filter((item) => item.statement.trim())
      .slice(0, 8)
      .map((item) => item.statement);

    const scenarios: ForecastScenario[] = [
      {
        id: 'baseline',
        type: 'baseline',
        horizon,
        outcome:
          'The future broadly follows the strongest currently observed signals, with normal variation.',
        probabilityRange: {
          low: clamp(0.35 + confidence * 0.1),
          high: clamp(0.55 + confidence * 0.2),
        },
        confidence,
        assumptions,
        evidence,
        uncertainty: [
          'Unexpected events can change the trajectory.',
          'Correlation does not establish causation.',
        ],
      },
      {
        id: 'upside',
        type: 'upside',
        horizon,
        outcome:
          'Positive signals strengthen and favorable conditions persist.',
        probabilityRange: {
          low: clamp(0.15 + confidence * 0.05),
          high: clamp(0.3 + confidence * 0.1),
        },
        confidence: clamp(confidence * 0.8),
        assumptions,
        evidence,
        uncertainty: [
          'Requires favorable conditions to persist.',
        ],
      },
      {
        id: 'downside',
        type: 'downside',
        horizon,
        outcome:
          'Negative risks become stronger or important assumptions fail.',
        probabilityRange: {
          low: clamp(0.15 + (1 - confidence) * 0.05),
          high: clamp(0.35 + (1 - confidence) * 0.15),
        },
        confidence: clamp(confidence * 0.75),
        assumptions,
        evidence,
        uncertainty: [
          'Risk indicators may not materialize.',
        ],
      },
    ];

    return {
      question: context.question,
      generatedAt: new Date().toISOString(),
      horizon,
      baseline:
        patterns.length > 0
          ? patterns.map((item) => item.description).join(' ')
          : 'There is insufficient evidence to establish a reliable trend.',
      scenarios,
      keyDrivers: patterns.map((item) => item.name),
      keyRisks: [
        'New information',
        'Structural changes',
        'Unexpected external events',
      ],
      missingInformation:
        observations.length < 3
          ? ['More time-series observations are needed for stronger calibration.']
          : [],
      calibrationRequired: true,
      factualEvidenceRequired: true,
      disclaimer:
        'This is an evidence-based forecast, not a guaranteed prediction. Probability ranges are model estimates and must be recalibrated as new evidence arrives.',
    };
  }
}

export default FutureForecastEngine;
