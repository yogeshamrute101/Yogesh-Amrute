import {
  ReferenceFeatures,
  ReferenceMatchPlan,
  ReferencePhoto,
} from './ReferenceMatchTypes';

export class ReferenceMatchPlanner {
  createPlan(
    reference: ReferencePhoto,
    features: ReferenceFeatures,
    resultCount = 4
  ): ReferenceMatchPlan {
    return {
      referenceId: reference.id,
      operations: [
        'analyze-reference',
        'capture-live-frame',
        'detect-subject',
        'match-framing',
        'match-scale',
        'match-position',
        'match-pose',
        'match-lighting',
        'match-color',
        'match-background',
        'match-edge',
        'quality-enhance',
        'generate-candidates',
        'verify-candidates',
      ],
      targetDimensions: [
        'identity',
        'face',
        'pose',
        'framing',
        'composition',
        'scale',
        'position',
        'lighting',
        'color',
        'background',
        'edge',
        'clothing',
        'style',
      ],
      minimumScore: features.confidence >= 0.75 ? 0.85 : 0.75,
      multipleResults: Math.max(2, Math.min(8, resultCount)),
    };
  }
}
