import { AiEditOperation, SupportedOpType } from '../../types';

export interface ParseResult {
  success: boolean;
  data?: {
    intent: string;
    explanation: string;
    operations: AiEditOperation[];
    warnings: string[];
  };
  error?: string;
}

const SUPPORTED_TYPES: Set<string> = new Set([
  'TRIM',
  'SPLIT',
  'DELETE',
  'MOVE',
  'DUPLICATE',
  'SPEED',
  'VOLUME',
  'MUTE',
  'ROTATE',
  'CROP',
  'FILTER',
  'TRANSITION',
  'TEXT',
  'CAPTION',
  'AUDIO',
  'REMOVE_SILENCE',
  'DETECT_SCENES',
  'CREATE_REEL',
  'CHANGE_ASPECT_RATIO',
  // legacy synonyms
  'ASPECT_RATIO',
  'ADD_CAPTIONS',
  'ADD_AUDIO',
  'MOVE_CLIP',
  'MAKE_REEL',
  'TRANSFORM',
  'COLOR_ADJUST',
  'ADD_STICKER',
  'BEAT_SYNC',
]);

/**
 * AiOperationParser
 * Safely parses and normalizes raw AI output into sanitized structured operations.
 * Never throws uncaught exceptions.
 */
export class AiOperationParser {
  static parse(raw: unknown): ParseResult {
    if (!raw) {
      return { success: false, error: 'Empty AI response received' };
    }

    let parsed: any;
    if (typeof raw === 'string') {
      const trimmed = raw.trim();
      if (!trimmed) {
        return { success: false, error: 'Empty AI response text' };
      }

      // Remove markdown code fences if present (```json ... ```)
      let cleaned = trimmed;
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
      }

      try {
        parsed = JSON.parse(cleaned);
      } catch (err: any) {
        return {
          success: false,
          error: `Malformed JSON from AI model: ${err.message || 'Syntax error'}`,
        };
      }
    } else if (typeof raw === 'object') {
      parsed = raw;
    } else {
      return { success: false, error: 'Invalid response format' };
    }

    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'AI response root must be a JSON object' };
    }

    const intent = typeof parsed.intent === 'string' && parsed.intent.trim()
      ? parsed.intent.trim()
      : 'AI Timeline Edit';

    const explanation = typeof parsed.explanation === 'string' && parsed.explanation.trim()
      ? parsed.explanation.trim()
      : 'Applied video edit operations';

    const rawOps = Array.isArray(parsed.operations) ? parsed.operations : [];
    const warnings: string[] = Array.isArray(parsed.warnings) ? [...parsed.warnings] : [];

    const normalizedOps: AiEditOperation[] = [];

    for (let i = 0; i < rawOps.length; i++) {
      const item = rawOps[i];
      if (!item || typeof item !== 'object') {
        warnings.push(`Omitted operation #${i + 1}: not an object`);
        continue;
      }

      const rawType = typeof item.type === 'string' ? item.type.toUpperCase().trim() : '';
      if (!rawType || !SUPPORTED_TYPES.has(rawType)) {
        warnings.push(`Omitted operation #${i + 1}: unsupported type "${rawType}"`);
        continue;
      }

      // Normalize operation synonyms into standard SupportedOpType
      let opType = rawType as SupportedOpType;
      if (rawType === 'ASPECT_RATIO') opType = 'CHANGE_ASPECT_RATIO';
      if (rawType === 'ADD_CAPTIONS') opType = 'CAPTION';
      if (rawType === 'ADD_AUDIO') opType = 'AUDIO';
      if (rawType === 'MOVE_CLIP') opType = 'MOVE';
      if (rawType === 'MAKE_REEL') opType = 'CREATE_REEL';

      const op: AiEditOperation = { type: opType };

      // Clip targeting
      if (typeof item.clipId === 'string' && item.clipId.trim()) {
        op.clipId = item.clipId.trim();
      }
      if (typeof item.clipIndex === 'number' && Number.isInteger(item.clipIndex)) {
        op.clipIndex = item.clipIndex;
      }

      // Timing
      if (typeof item.startMs === 'number') op.startMs = item.startMs;
      if (typeof item.endMs === 'number') op.endMs = item.endMs;
      if (typeof item.newStartTrimMs === 'number') op.newStartTrimMs = item.newStartTrimMs;
      if (typeof item.newEndTrimMs === 'number') op.newEndTrimMs = item.newEndTrimMs;
      if (typeof item.splitAtMs === 'number') op.splitAtMs = item.splitAtMs;

      // Numeric values
      if (typeof item.value === 'number') op.value = item.value;
      if (typeof item.speed === 'number') op.speed = item.speed;
      if (typeof item.volume === 'number') op.volume = item.volume;
      if (typeof item.degrees === 'number') op.degrees = item.degrees;
      if (typeof item.rotation === 'number') op.rotation = item.rotation;

      // Map value based on operation
      if (op.type === 'SPEED' && op.value !== undefined && op.speed === undefined) {
        op.speed = op.value;
      }
      if (op.type === 'VOLUME' && op.value !== undefined && op.volume === undefined) {
        op.volume = op.value;
      }
      if (op.type === 'ROTATE' && op.degrees !== undefined && op.rotation === undefined) {
        op.rotation = op.degrees;
      }

      // Crop
      if (item.crop && typeof item.crop === 'object') {
        op.crop = {
          x: Number(item.crop.x) || 0,
          y: Number(item.crop.y) || 0,
          width: Number(item.crop.width) || 100,
          height: Number(item.crop.height) || 100,
        };
      }

      // Transform & Color
      if (item.transform && typeof item.transform === 'object') op.transform = item.transform;
      if (item.colorAdjustments && typeof item.colorAdjustments === 'object') op.colorAdjustments = item.colorAdjustments;

      // Flags
      if (typeof item.enabled === 'boolean') op.enabled = item.enabled;
      if (typeof item.isMuted === 'boolean') op.isMuted = item.isMuted;
      if (typeof item.muted === 'boolean') op.muted = item.muted;
      if (typeof item.dynamic === 'boolean') op.dynamic = item.dynamic;

      // Aesthetics
      if (typeof item.filter === 'string') op.filter = item.filter.toLowerCase() as any;
      if (typeof item.name === 'string') op.name = item.name;
      if (typeof item.transition === 'string') op.transition = item.transition.toLowerCase() as any;
      if (typeof item.content === 'string') op.content = item.content;
      if (typeof item.text === 'string') op.text = item.text;
      if (typeof item.captionText === 'string') op.captionText = item.captionText;
      if (typeof item.style === 'string') op.style = item.style as any;
      if (typeof item.genre === 'string') op.genre = item.genre.toLowerCase() as any;
      if (typeof item.audioVibe === 'string') op.audioVibe = item.audioVibe;
      if (typeof item.aspectRatio === 'string') op.aspectRatio = item.aspectRatio as any;
      if (typeof item.thresholdDb === 'number') op.thresholdDb = item.thresholdDb;
      if (typeof item.sensitivity === 'number') op.sensitivity = item.sensitivity;
      if (typeof item.targetDurationSec === 'number') op.targetDurationSec = item.targetDurationSec;
      if (typeof item.preset === 'string') op.preset = item.preset as any;

      // Indices
      if (typeof item.fromIndex === 'number') op.fromIndex = item.fromIndex;
      if (typeof item.toIndex === 'number') op.toIndex = item.toIndex;
      if (item.sticker && typeof item.sticker === 'object') op.sticker = item.sticker;

      normalizedOps.push(op);
    }

    return {
      success: true,
      data: {
        intent,
        explanation,
        operations: normalizedOps,
        warnings,
      },
    };
  }
}
