import {
  AiCropValues,
  AiEditOperation,
  AspectRatio,
  FilterType,
  ProjectTimeline,
  SupportedOpType,
  TimelineClip,
  TransitionType,
  ValidationReport,
} from '../types';

const VALID_FILTERS: FilterType[] = [
  'none',
  'cinematic',
  'cyberpunk',
  'warm_vintage',
  'noir',
  'vibrant',
  'golden_hour',
];

const VALID_TRANSITIONS: TransitionType[] = [
  'none',
  'cut',
  'fade',
  'dissolve',
  'wipe',
  'zoom_in',
  'slide_left',
  'glitch',
];

const VALID_ASPECT_RATIOS: AspectRatio[] = ['9:16', '1:1', '16:9', '4:5'];
const VALID_ROTATIONS = [0, 90, 180, 270];
const VALID_AUDIO_GENRES = ['phonk', 'lofi', 'cinematic', 'ambient'];

const MAX_OPERATIONS_COUNT = 30;
const MIN_SPEED = 0.25;
const MAX_SPEED = 4.0;
const MIN_VOLUME = 0.0;
const MAX_VOLUME = 1.0;

/**
 * AI Operation Validator
 * Guarantees that AI-generated structured operations strictly adhere to:
 * - Clip existence in timeline
 * - Range limits (timing, speed, volume, rotation, crop)
 * - Safe operation count ceiling
 * - Supported operation types
 * - Non-empty timeline integrity
 * 
 * If validation fails, returns isValid: false and timeline is NEVER modified.
 */
export function validateAiOperations(
  rawOperations: AiEditOperation[],
  timeline: ProjectTimeline
): ValidationReport {
  const validatedOperations: AiEditOperation[] = [];
  const warnings: string[] = [];

  if (!Array.isArray(rawOperations) || rawOperations.length === 0) {
    return {
      isValid: false,
      validatedOperations: [],
      warnings: ['No operations provided in AI response payload'],
      appliedCount: 0,
      error: 'No operations provided in AI response payload',
    };
  }

  if (rawOperations.length > MAX_OPERATIONS_COUNT) {
    return {
      isValid: false,
      validatedOperations: [],
      warnings: [`Operations count (${rawOperations.length}) exceeds safe limit (${MAX_OPERATIONS_COUNT})`],
      appliedCount: 0,
      error: `Operations count exceeds safe limit of ${MAX_OPERATIONS_COUNT}`,
    };
  }

  // Check timeline clips integrity
  if (!timeline || !Array.isArray(timeline.clips)) {
    return {
      isValid: false,
      validatedOperations: [],
      warnings: ['Current timeline has invalid clips collection'],
      appliedCount: 0,
      error: 'Current timeline has invalid clips collection',
    };
  }

  for (let i = 0; i < rawOperations.length; i++) {
    const op = rawOperations[i];
    if (!op || typeof op.type !== 'string') {
      return {
        isValid: false,
        validatedOperations: [],
        warnings: [`Operation #${i + 1} is missing a valid type property`],
        appliedCount: 0,
        error: `Operation #${i + 1} has malformed or missing type`,
      };
    }

    const opType = op.type.toUpperCase() as SupportedOpType;

    switch (opType) {
      case 'TRIM': {
        const target = resolveTargetClip(op, timeline);
        if (!target) {
          return {
            isValid: false,
            validatedOperations: [],
            warnings: [`Clip ID "${op.clipId || op.clipIndex}" not found in current timeline`],
            appliedCount: 0,
            error: `Target clip "${op.clipId || op.clipIndex}" not found for TRIM`,
          };
        }

        const start = op.newStartTrimMs ?? op.startMs ?? 0;
        const end = op.newEndTrimMs ?? op.endMs ?? target.endTrimMs;
        const sourceDuration = target.originalDurationMs || 30000;

        if (start < 0) {
          return {
            isValid: false,
            validatedOperations: [],
            warnings: [`Invalid startMs (${start}ms) < 0 on clip "${target.name}"`],
            appliedCount: 0,
            error: `TRIM startMs must be >= 0 (got ${start})`,
          };
        }

        if (end <= start) {
          return {
            isValid: false,
            validatedOperations: [],
            warnings: [`Invalid trim bounds: endMs (${end}ms) must be greater than startMs (${start}ms)`],
            appliedCount: 0,
            error: `TRIM endMs (${end}ms) must be strictly greater than startMs (${start}ms)`,
          };
        }

        if (end > sourceDuration + 10) {
          return {
            isValid: false,
            validatedOperations: [],
            warnings: [`Trim end (${end}ms) exceeds source duration (${sourceDuration}ms) on "${target.name}"`],
            appliedCount: 0,
            error: `TRIM endMs (${end}ms) exceeds source duration (${sourceDuration}ms)`,
          };
        }

        validatedOperations.push({
          type: 'TRIM',
          clipId: target.id,
          startMs: Math.round(start),
          endMs: Math.round(Math.min(sourceDuration, end)),
          newStartTrimMs: Math.round(start),
          newEndTrimMs: Math.round(Math.min(sourceDuration, end)),
        });
        break;
      }

      case 'SPLIT': {
        const target = resolveTargetClip(op, timeline);
        if (!target) {
          return {
            isValid: false,
            validatedOperations: [],
            warnings: [`Target clip for SPLIT not found: ${op.clipId || op.clipIndex}`],
            appliedCount: 0,
            error: `Target clip not found for SPLIT`,
          };
        }

        const duration = target.endTrimMs - target.startTrimMs;
        const splitPoint = op.splitAtMs;

        if (typeof splitPoint !== 'number' || splitPoint <= 0 || splitPoint >= duration) {
          return {
            isValid: false,
            validatedOperations: [],
            warnings: [`Invalid splitAtMs (${splitPoint}ms) on clip of duration ${duration}ms`],
            appliedCount: 0,
            error: `Split point (${splitPoint}ms) is outside clip duration (0 - ${duration}ms)`,
          };
        }

        validatedOperations.push({
          type: 'SPLIT',
          clipId: target.id,
          splitAtMs: Math.round(splitPoint),
        });
        break;
      }

      case 'SPEED': {
        const target = op.clipId || typeof op.clipIndex === 'number' ? resolveTargetClip(op, timeline) : null;
        const rawSpeed = op.speed ?? op.value ?? 1.0;

        if (typeof rawSpeed !== 'number' || Number.isNaN(rawSpeed)) {
          return {
            isValid: false,
            validatedOperations: [],
            warnings: ['SPEED operation missing valid numeric value'],
            appliedCount: 0,
            error: 'Speed value must be a valid number',
          };
        }

        if (rawSpeed < MIN_SPEED || rawSpeed > MAX_SPEED) {
          return {
            isValid: false,
            validatedOperations: [],
            warnings: [`Speed ${rawSpeed}x is outside supported range [${MIN_SPEED}x - ${MAX_SPEED}x]`],
            appliedCount: 0,
            error: `Speed value (${rawSpeed}x) must be between ${MIN_SPEED}x and ${MAX_SPEED}x`,
          };
        }

        validatedOperations.push({
          type: 'SPEED',
          clipId: target?.id,
          speed: Math.round(rawSpeed * 100) / 100,
          value: Math.round(rawSpeed * 100) / 100,
        });
        break;
      }

      case 'VOLUME': {
        const target = op.clipId || typeof op.clipIndex === 'number' ? resolveTargetClip(op, timeline) : null;
        const rawVol = op.volume ?? op.value ?? 1.0;

        if (typeof rawVol !== 'number' || Number.isNaN(rawVol)) {
          return {
            isValid: false,
            validatedOperations: [],
            warnings: ['VOLUME operation missing valid numeric value'],
            appliedCount: 0,
            error: 'Volume value must be a valid number',
          };
        }

        if (rawVol < MIN_VOLUME || rawVol > MAX_VOLUME) {
          return {
            isValid: false,
            validatedOperations: [],
            warnings: [`Volume ${rawVol} is outside valid range [${MIN_VOLUME} - ${MAX_VOLUME}]`],
            appliedCount: 0,
            error: `Volume value (${rawVol}) must be between ${MIN_VOLUME} and ${MAX_VOLUME}`,
          };
        }

        validatedOperations.push({
          type: 'VOLUME',
          clipId: target?.id,
          volume: Math.round(rawVol * 100) / 100,
          value: Math.round(rawVol * 100) / 100,
          isMuted: Boolean(op.isMuted || op.muted),
        });
        break;
      }

      case 'MUTE': {
        const target = resolveTargetClip(op, timeline);
        if (!target) {
          return {
            isValid: false,
            validatedOperations: [],
            warnings: ['Target clip for MUTE not found'],
            appliedCount: 0,
            error: 'Target clip not found for MUTE',
          };
        }

        validatedOperations.push({
          type: 'MUTE',
          clipId: target.id,
          isMuted: op.isMuted !== undefined ? op.isMuted : (op.muted !== undefined ? op.muted : true),
        });
        break;
      }

      case 'ROTATE': {
        const target = resolveTargetClip(op, timeline);
        if (!target) {
          return {
            isValid: false,
            validatedOperations: [],
            warnings: ['Target clip for ROTATE not found'],
            appliedCount: 0,
            error: 'Target clip not found for ROTATE',
          };
        }

        const deg = op.rotation ?? op.degrees ?? 0;
        if (!VALID_ROTATIONS.includes(deg)) {
          return {
            isValid: false,
            validatedOperations: [],
            warnings: [`Invalid rotation ${deg}°. Must be 0, 90, 180, or 270 degrees`],
            appliedCount: 0,
            error: `Rotation must be one of [0, 90, 180, 270] degrees (got ${deg})`,
          };
        }

        validatedOperations.push({
          type: 'ROTATE',
          clipId: target.id,
          rotation: deg,
          degrees: deg,
        });
        break;
      }

      case 'CROP': {
        const target = resolveTargetClip(op, timeline);
        if (!target) {
          return {
            isValid: false,
            validatedOperations: [],
            warnings: ['Target clip for CROP not found'],
            appliedCount: 0,
            error: 'Target clip not found for CROP',
          };
        }

        const crop = op.crop;
        if (!crop || typeof crop !== 'object') {
          return {
            isValid: false,
            validatedOperations: [],
            warnings: ['CROP operation missing { x, y, width, height }'],
            appliedCount: 0,
            error: 'CROP operation requires { x, y, width, height } percentage values',
          };
        }

        const { x, y, width, height } = crop;
        if (
          typeof x !== 'number' || typeof y !== 'number' ||
          typeof width !== 'number' || typeof height !== 'number' ||
          x < 0 || y < 0 || width <= 0 || height <= 0 ||
          x + width > 100 || y + height > 100
        ) {
          return {
            isValid: false,
            validatedOperations: [],
            warnings: [`Invalid crop boundary: [x:${x}, y:${y}, w:${width}, h:${height}]`],
            appliedCount: 0,
            error: `Invalid crop dimensions. Must be inside 0-100% bounds`,
          };
        }

        validatedOperations.push({
          type: 'CROP',
          clipId: target.id,
          crop: { x, y, width, height },
        });
        break;
      }

      case 'FILTER': {
        const filterName = (op.filter || op.name || 'vibrant').toLowerCase() as FilterType;
        if (!VALID_FILTERS.includes(filterName)) {
          return {
            isValid: false,
            validatedOperations: [],
            warnings: [`Unknown filter "${filterName}". Supported: ${VALID_FILTERS.join(', ')}`],
            appliedCount: 0,
            error: `Unsupported filter "${filterName}"`,
          };
        }

        const target = op.clipId || typeof op.clipIndex === 'number' ? resolveTargetClip(op, timeline) : null;
        validatedOperations.push({
          type: 'FILTER',
          clipId: target?.id,
          filter: filterName,
          name: filterName,
        });
        break;
      }

      case 'TRANSITION': {
        const trans = (op.transition || 'fade').toLowerCase() as TransitionType;
        if (!VALID_TRANSITIONS.includes(trans)) {
          return {
            isValid: false,
            validatedOperations: [],
            warnings: [`Unknown transition "${trans}". Supported: ${VALID_TRANSITIONS.join(', ')}`],
            appliedCount: 0,
            error: `Unsupported transition "${trans}"`,
          };
        }

        const target = resolveTargetClip(op, timeline);
        validatedOperations.push({
          type: 'TRANSITION',
          clipId: target ? target.id : timeline.clips[0]?.id,
          transition: trans,
        });
        break;
      }

      case 'MOVE':
      case 'MOVE_CLIP': {
        const from = op.fromIndex;
        const to = op.toIndex;

        if (
          typeof from !== 'number' || typeof to !== 'number' ||
          from < 0 || from >= timeline.clips.length ||
          to < 0 || to >= timeline.clips.length
        ) {
          return {
            isValid: false,
            validatedOperations: [],
            warnings: [`MOVE indices out of bounds (from: ${from}, to: ${to}, clipCount: ${timeline.clips.length})`],
            appliedCount: 0,
            error: `MOVE indices [${from} -> ${to}] out of timeline bounds (0 - ${timeline.clips.length - 1})`,
          };
        }

        validatedOperations.push({
          type: 'MOVE',
          fromIndex: from,
          toIndex: to,
        });
        break;
      }

      case 'DUPLICATE': {
        const target = resolveTargetClip(op, timeline);
        if (!target) {
          return {
            isValid: false,
            validatedOperations: [],
            warnings: ['Target clip for DUPLICATE not found'],
            appliedCount: 0,
            error: 'Target clip not found for DUPLICATE',
          };
        }

        validatedOperations.push({
          type: 'DUPLICATE',
          clipId: target.id,
        });
        break;
      }

      case 'DELETE': {
        const target = resolveTargetClip(op, timeline);
        if (!target) {
          return {
            isValid: false,
            validatedOperations: [],
            warnings: ['Target clip for DELETE not found'],
            appliedCount: 0,
            error: 'Target clip not found for DELETE',
          };
        }

        if (timeline.clips.length <= 1) {
          return {
            isValid: false,
            validatedOperations: [],
            warnings: ['Cannot delete the only clip in the timeline'],
            appliedCount: 0,
            error: 'Cannot delete the only clip in the timeline (at least 1 clip required)',
          };
        }

        validatedOperations.push({
          type: 'DELETE',
          clipId: target.id,
          isDestructive: true,
        });
        break;
      }

      case 'TEXT': {
        const textContent = op.content || op.text;
        if (!textContent || typeof textContent !== 'string') {
          return {
            isValid: false,
            validatedOperations: [],
            warnings: ['TEXT operation missing text content'],
            appliedCount: 0,
            error: 'TEXT operation requires non-empty text content',
          };
        }

        validatedOperations.push({
          type: 'TEXT',
          content: textContent.trim(),
          text: textContent.trim(),
          startMs: Math.max(0, op.startMs || 0),
          endMs: Math.max(1000, op.endMs || 4000),
          style: op.style || 'yellow_viral',
        });
        break;
      }

      case 'CAPTION':
      case 'ADD_CAPTIONS': {
        validatedOperations.push({
          type: 'CAPTION',
          enabled: op.enabled !== false,
          captionText: op.captionText || op.text || '🔥 Trending Reel Moment',
          dynamic: Boolean(op.dynamic ?? true),
          style: op.style || 'yellow_viral',
        });
        break;
      }

      case 'AUDIO':
      case 'ADD_AUDIO':
      case 'BEAT_SYNC': {
        const genre = (op.genre || op.audioVibe || 'phonk').toLowerCase();
        const safeGenre = VALID_AUDIO_GENRES.includes(genre) ? genre : 'phonk';

        validatedOperations.push({
          type: 'AUDIO',
          genre: safeGenre as any,
          audioVibe: safeGenre,
          volume: typeof op.volume === 'number' ? Math.max(0, Math.min(1, op.volume)) : 0.7,
        });
        break;
      }

      case 'REMOVE_SILENCE': {
        const threshold = typeof op.thresholdDb === 'number'
          ? Math.max(-60, Math.min(-15, op.thresholdDb))
          : -35;

        validatedOperations.push({
          type: 'REMOVE_SILENCE',
          thresholdDb: threshold,
        });
        break;
      }

      case 'DETECT_SCENES': {
        validatedOperations.push({
          type: 'DETECT_SCENES',
          sensitivity: typeof op.sensitivity === 'number' ? Math.max(0.1, Math.min(1.0, op.sensitivity)) : 0.7,
        });
        break;
      }

      case 'CREATE_REEL':
      case 'MAKE_REEL': {
        validatedOperations.push({
          type: 'CREATE_REEL',
          preset: op.preset || 'Viral Reel',
          targetDurationSec: op.targetDurationSec || 15,
          genre: (op.genre || 'phonk') as any,
        });
        break;
      }

      case 'CHANGE_ASPECT_RATIO':
      case 'ASPECT_RATIO': {
        const ratio = op.aspectRatio || '9:16';
        if (!VALID_ASPECT_RATIOS.includes(ratio)) {
          return {
            isValid: false,
            validatedOperations: [],
            warnings: [`Invalid aspect ratio "${ratio}". Supported: ${VALID_ASPECT_RATIOS.join(', ')}`],
            appliedCount: 0,
            error: `Unsupported aspect ratio "${ratio}"`,
          };
        }

        validatedOperations.push({
          type: 'CHANGE_ASPECT_RATIO',
          aspectRatio: ratio,
        });
        break;
      }

      case 'TRANSFORM': {
        const target = resolveTargetClip(op, timeline);
        if (target) {
          validatedOperations.push({
            type: 'TRANSFORM',
            clipId: target.id,
            transform: op.transform,
          });
        }
        break;
      }

      case 'COLOR_ADJUST': {
        const target = resolveTargetClip(op, timeline);
        if (target) {
          validatedOperations.push({
            type: 'COLOR_ADJUST',
            clipId: target.id,
            colorAdjustments: op.colorAdjustments,
          });
        }
        break;
      }

      case 'ADD_STICKER': {
        if (op.sticker && op.sticker.content) {
          validatedOperations.push({
            type: 'ADD_STICKER',
            sticker: op.sticker,
          });
        }
        break;
      }

      default:
        return {
          isValid: false,
          validatedOperations: [],
          warnings: [`Unsupported operation type: ${op.type}`],
          appliedCount: 0,
          error: `Operation type "${op.type}" is not supported`,
        };
    }
  }

  return {
    isValid: validatedOperations.length > 0,
    validatedOperations,
    warnings,
    appliedCount: validatedOperations.length,
  };
}

function resolveTargetClip(op: AiEditOperation, timeline: ProjectTimeline): TimelineClip | null {
  if (op.clipId) {
    const found = timeline.clips.find((c) => c.id === op.clipId);
    if (found) return found;
    // If explicit clipId was provided and not found, return null so validation can fail
    return null;
  }
  if (typeof op.clipIndex === 'number' && Number.isInteger(op.clipIndex)) {
    if (timeline.clips[op.clipIndex]) {
      return timeline.clips[op.clipIndex];
    }
    return null;
  }
  // Default to first clip if no ID or index was specified
  return timeline.clips[0] || null;
}
