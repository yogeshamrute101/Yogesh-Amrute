import {
  AutoEditOperation,
  AutoMediaInput,
  AutoMediaPlan,
} from './AutoMediaTypes';
import { AutoMediaAnalyzer } from './AutoMediaAnalyzer';

export class AutoMediaPlanner {
  private readonly analyzer = new AutoMediaAnalyzer();

  plan(input: AutoMediaInput): AutoMediaPlan {
    const analysis = this.analyzer.analyze(input);
    const operations: AutoEditOperation[] = [];
    const reason: string[] = [];

    if (analysis.type === 'image') {
      if (analysis.backgroundDetected && analysis.subjectDetected) {
        operations.push('background-remove');
        reason.push('Subject and background detected; background editing can be considered.');
      }

      if (analysis.needsClarity) {
        operations.push('clarity', 'sharpness', 'denoise');
        reason.push('Image quality signals indicate possible clarity improvement.');
      }

      if (analysis.needsUpscale) {
        operations.push('upscale');
        reason.push('Input resolution may benefit from upscaling.');
      }

      if (analysis.needsCrop) {
        operations.push('crop');
      }

      operations.push('export-optimize');
    }

    if (analysis.type === 'video') {
      if (analysis.needsTrim) {
        operations.push('auto-trim', 'silence-trim', 'scene-trim');
        reason.push('Video can be analyzed for unnecessary segments and silence.');
      }

      if (analysis.needsReframe) {
        operations.push('reframe');
        reason.push('Video can be evaluated for automatic framing.');
      }

      if (analysis.hasAudio) {
        operations.push('audio-cleanup');
      }

      if (analysis.hasSpeech) {
        operations.push('captions');
      }

      if (analysis.needsClarity) {
        operations.push('clarity', 'denoise');
      }

      operations.push('export-optimize');
    }

    return {
      mediaId: input.id,
      mediaType: input.type,
      operations,
      reason,
      requiresProvider: operations.some(operation =>
        [
          'background-remove',
          'background-change',
          'upscale',
          'denoise',
          'stabilize',
          'auto-trim',
          'silence-trim',
          'scene-trim',
          'reframe',
          'audio-cleanup',
          'captions',
        ].includes(operation)
      ),
      approvalRequired: false,
    };
  }
}
