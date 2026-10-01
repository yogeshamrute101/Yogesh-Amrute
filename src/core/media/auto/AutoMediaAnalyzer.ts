import {
  AutoMediaInput,
  AutoMediaType,
  MediaQualitySignals,
} from './AutoMediaTypes';

export interface AutoMediaAnalysis {
  type: AutoMediaType;
  subjectDetected: boolean;
  backgroundDetected: boolean;
  needsClarity: boolean;
  needsUpscale: boolean;
  needsCrop: boolean;
  needsReframe: boolean;
  needsTrim: boolean;
  hasAudio: boolean;
  hasSpeech: boolean;
  hasText: boolean;
  quality: MediaQualitySignals;
}

export class AutoMediaAnalyzer {
  analyze(input: AutoMediaInput): AutoMediaAnalysis {
    const quality = input.quality ?? {};
    const width = quality.width ?? 0;
    const height = quality.height ?? 0;
    const sharpness = quality.sharpness ?? 1;
    const blur = quality.blur ?? 0;

    return {
      type: input.type,
      subjectDetected: input.hasSubject ?? false,
      backgroundDetected: input.backgroundDetected ?? false,
      needsClarity: sharpness < 0.65 || blur > 0.35,
      needsUpscale: width > 0 && height > 0 && (width < 1280 || height < 720),
      needsCrop: false,
      needsReframe: input.type === 'video',
      needsTrim: input.type === 'video',
      hasAudio: input.hasAudio ?? false,
      hasSpeech: input.hasSpeech ?? false,
      hasText: input.hasText ?? false,
      quality,
    };
  }
}
