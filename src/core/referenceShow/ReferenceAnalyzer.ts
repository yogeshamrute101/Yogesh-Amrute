import type {
  ReferenceAnalysis,
  ReferenceType,
} from '../../types/ReferenceShow';

function detectType(url: string): ReferenceType {
  const value = url.toLowerCase();

  if (
    value.includes('youtube') ||
    value.includes('youtu.be')
  ) {
    return 'web_show';
  }

  if (
    value.includes('news') ||
    value.includes('broadcast')
  ) {
    return 'news_program';
  }

  return 'unknown';
}

export function analyzeReference(
  sourceUrl: string,
): ReferenceAnalysis {
  if (!sourceUrl.trim()) {
    throw new Error('Reference URL is required.');
  }

  return {
    sourceUrl,
    type: detectType(sourceUrl),
    format: 'reference-derived show format',
    segmentStructure: [
      'opening',
      'host introduction',
      'main subject',
      'supporting segment',
      'visual explanation',
      'audience interaction',
      'closing',
    ],
    presentationStyle:
      'professional live presentation adapted into an original production',
    cameraLanguage: [
      'wide establishing shot',
      'host medium shot',
      'close-up',
      'cutaway',
      'dynamic transition',
    ],
    staging:
      'subject-appropriate live studio or performance environment',
    pacing:
      'reference-informed pacing with original scene timing',
    audienceInteraction:
      'optional AI audience reactions and interaction',
    audioStructure: [
      'host voice',
      'background ambience',
      'transition cues',
      'music bed',
    ],
    visualPatterns: [
      'reference-informed composition',
      'segment transitions',
      'subject-specific graphics',
    ],
    productionElements: [
      'studio/set design',
      'camera switching',
      'graphics',
      'lighting',
      'audio mixing',
    ],
    originalityRequirements: [
      'generate original scenes',
      'generate original scripts',
      'do not copy source footage',
      'do not reproduce protected branding',
      'use authorized identity/voice assets only',
    ],
  };
}
