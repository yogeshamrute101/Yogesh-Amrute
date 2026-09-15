import { ProjectTimeline } from '../../types';
import { AiOperationParser, ParseResult } from './AiOperationParser';
import { AiResponseValidator } from './AiResponseValidator';

export interface CoPilotRequestOptions {
  prompt: string;
  timeline: ProjectTimeline;
  timeoutMs?: number;
}

export interface CoPilotResponse {
  success: boolean;
  data?: {
    intent: string;
    explanation: string;
    operations: any[];
    warnings: string[];
    recommendedTitle?: string;
    tips?: string;
  };
  error?: string;
  code?: 'NETWORK_TIMEOUT' | 'QUOTA_EXCEEDED' | 'AUTH_FAILURE' | 'MALFORMED_JSON' | 'UNAVAILABLE' | 'VALIDATION_FAILED';
}

/**
 * GeminiProvider
 * Secure client-side provider abstraction that handles communication with the backend
 * AI endpoints, network timeout enforcement, offline detection, and error classification.
 * The UI never touches direct Gemini keys or internal SDK methods.
 */
export class GeminiProvider {
  private static DEFAULT_TIMEOUT_MS = 20000;

  static async requestEdit(options: CoPilotRequestOptions): Promise<CoPilotResponse> {
    const { prompt, timeline, timeoutMs = this.DEFAULT_TIMEOUT_MS } = options;

    if (!prompt || !prompt.trim()) {
      return {
        success: false,
        error: 'Prompt cannot be empty',
        code: 'VALIDATION_FAILED',
      };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      // Calculate light timeline summary to send
      const totalDurationMs = timeline.clips.reduce(
        (acc, c) => acc + (c.endTrimMs - c.startTrimMs) / (c.speed || 1.0),
        0
      );

      const response = await fetch('/api/ai/co-pilot-edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          currentTimeline: {
            clipCount: timeline.clips.length,
            aspectRatio: timeline.aspectRatio,
            totalDurationMs,
            clips: timeline.clips.map((c) => ({
              id: c.id,
              name: c.name,
              durationMs: c.endTrimMs - c.startTrimMs,
              originalDurationMs: c.originalDurationMs,
              speed: c.speed,
              volume: c.volume,
              isMuted: c.isMuted,
              filter: c.filter,
              transition: c.transition,
            })),
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 429) {
          return {
            success: false,
            error: 'AI rate limit reached. Please try again in a moment.',
            code: 'QUOTA_EXCEEDED',
          };
        }
        if (response.status === 401 || response.status === 403) {
          return {
            success: false,
            error: 'AI authentication error. Check server credentials.',
            code: 'AUTH_FAILURE',
          };
        }
        return {
          success: false,
          error: 'AI is temporarily unavailable.',
          code: 'UNAVAILABLE',
        };
      }

      const json = await response.json();
      if (!json || !json.success || !json.data) {
        return {
          success: false,
          error: json?.error || 'AI is temporarily unavailable.',
          code: 'UNAVAILABLE',
        };
      }

      // Pass response through strict parser & top-level schema validator
      const parseResult: ParseResult = AiOperationParser.parse(json.data);
      if (!parseResult.success || !parseResult.data) {
        return {
          success: false,
          error: parseResult.error || 'Failed to parse AI operations',
          code: 'MALFORMED_JSON',
        };
      }

      const topValidation = AiResponseValidator.validate(parseResult.data);
      if (!topValidation.isValid) {
        return {
          success: false,
          error: topValidation.error || 'Invalid AI response schema',
          code: 'VALIDATION_FAILED',
        };
      }

      return {
        success: true,
        data: {
          ...parseResult.data,
          recommendedTitle: json.data.recommendedTitle,
          tips: json.data.tips,
        },
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        return {
          success: false,
          error: 'AI request timed out. Pacing and network slow.',
          code: 'NETWORK_TIMEOUT',
        };
      }
      return {
        success: false,
        error: 'AI is temporarily unavailable.',
        code: 'UNAVAILABLE',
      };
    }
  }

  static async requestReelMaker(options: {
    clips: any[];
    preset: string;
    targetDurationSec: number;
    musicGenre: string;
    timeoutMs?: number;
  }): Promise<CoPilotResponse> {
    const { clips, preset, targetDurationSec, musicGenre, timeoutMs = 25000 } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch('/api/ai/reel-maker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clips,
          vibe: preset,
          targetDurationSec,
          musicGenre,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return {
          success: false,
          error: 'AI is temporarily unavailable.',
          code: 'UNAVAILABLE',
        };
      }

      const json = await response.json();
      if (!json || !json.success || !json.data) {
        return {
          success: false,
          error: json?.error || 'AI is temporarily unavailable.',
          code: 'UNAVAILABLE',
        };
      }

      const parseResult = AiOperationParser.parse(json.data);
      if (!parseResult.success || !parseResult.data) {
        return {
          success: false,
          error: parseResult.error || 'Failed to parse Reel Maker operations',
          code: 'MALFORMED_JSON',
        };
      }

      return {
        success: true,
        data: {
          ...parseResult.data,
          recommendedTitle: json.data.title,
        },
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
      return {
        success: false,
        error: 'AI is temporarily unavailable.',
        code: 'UNAVAILABLE',
      };
    }
  }
}
