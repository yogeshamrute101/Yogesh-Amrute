import { analyzeReference } from '../../core/referenceShow/ReferenceAnalyzer';
import type {
  LiveShowPlan,
  ReferenceAnalysis,
} from '../../types/ReferenceShow';

export function createLiveShowFromReference(
  sourceUrl: string,
  subject: string,
): LiveShowPlan {
  const analysis: ReferenceAnalysis =
    analyzeReference(sourceUrl);

  return {
    id: `live-show-${Date.now()}`,
    title: `AI Live — ${subject}`,
    sourceReference: sourceUrl,
    format: analysis.format,
    host: {
      role: 'AI host/presenter',
      presentationStyle: analysis.presentationStyle,
      voiceDirection:
        'natural original voice appropriate to the selected host',
      appearanceDirection:
        'original AI presenter appearance matching the selected role and subject',
    },
    set: {
      environment: analysis.staging,
      background:
        `original production design inspired by the reference format for ${subject}`,
      lighting:
        'professional live-show lighting adapted to subject',
      props: analysis.productionElements,
    },
    segments: analysis.segmentStructure.map(
      (segment, index) => ({
        id: `segment-${index + 1}`,
        title: segment,
        durationSeconds: index === 0 ? 30 : 60,
        purpose:
          `Original ${segment} segment for ${subject}`,
        visualDirection:
          'AI-generated original visuals appropriate to the segment',
        hostDirection:
          analysis.presentationStyle,
        cameraDirection:
          analysis.cameraLanguage[index %
            analysis.cameraLanguage.length],
        audienceDirection:
          analysis.audienceInteraction,
      }),
    ),
    graphics: analysis.visualPatterns,
    audio: analysis.audioStructure,
    safety: {
      originalProduction: true,
      noExactCopyrightedFootage: true,
      noUnauthorizedVoiceClone: true,
      noUnauthorizedLikenessClone: true,
    },
  };
}

export function validateReferenceShow(
  plan: LiveShowPlan,
): string[] {
  const errors: string[] = [];

  if (!plan.sourceReference) {
    errors.push('Reference source is missing.');
  }

  if (!plan.segments.length) {
    errors.push('No show segments generated.');
  }

  if (!plan.safety.originalProduction) {
    errors.push('Production must be original.');
  }

  if (!plan.safety.noExactCopyrightedFootage) {
    errors.push('Exact source footage cannot be used by default.');
  }

  if (!plan.safety.noUnauthorizedVoiceClone) {
    errors.push('Unauthorized voice cloning is disabled.');
  }

  if (!plan.safety.noUnauthorizedLikenessClone) {
    errors.push('Unauthorized likeness cloning is disabled.');
  }

  return errors;
}
