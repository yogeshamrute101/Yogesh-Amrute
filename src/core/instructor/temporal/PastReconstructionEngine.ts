import {
  EvidenceQuality,
  TemporalContext,
  TemporalObservation,
} from './TemporalTypes';

const qualityWeight: Record<EvidenceQuality, number> = {
  verified: 1,
  strong: 0.85,
  moderate: 0.65,
  weak: 0.4,
  unknown: 0.15,
};

export class PastReconstructionEngine {
  reconstruct(context: TemporalContext): {
    timeline: TemporalObservation[];
    confidence: number;
    uncertainty: string[];
  } {
    const observations = [
      ...(context.pastObservations ?? []),
      ...(context.presentObservations ?? []),
    ]
      .filter(Boolean)
      .sort((a, b) =>
        String(a.timestamp ?? '').localeCompare(String(b.timestamp ?? '')),
      );

    if (!observations.length) {
      return {
        timeline: [],
        confidence: 0,
        uncertainty: ['No historical evidence was supplied.'],
      };
    }

    const confidence =
      observations.reduce(
        (sum, item) =>
          sum +
          Math.max(
            0,
            Math.min(1, item.confidence),
          ) *
            qualityWeight[item.evidenceQuality],
        0,
      ) / observations.length;

    const uncertainty: string[] = [];

    if (confidence < 0.5) {
      uncertainty.push(
        'Historical reconstruction is based on limited or low-quality evidence.',
      );
    }

    if (observations.some((item) => item.evidenceQuality === 'unknown')) {
      uncertainty.push('Some observations have unknown evidence quality.');
    }

    return {
      timeline: observations,
      confidence,
      uncertainty,
    };
  }
}

export default PastReconstructionEngine;
