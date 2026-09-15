import { AiEditOperation, AiPlanItem, ProjectTimeline, ReelPreset } from '../../types';

export interface PlanAnalysis {
  summaryItems: string[];
  planItems: AiPlanItem[];
  destructivePrompt: string | null;
  estimatedDurationMs: number;
}

/**
 * AiEditPlanner
 * Translates low-level operations into high-level human-readable edit plan previews
 * and scans for potentially destructive operations that require explicit user confirmation.
 */
export class AiEditPlanner {
  static analyzePlan(operations: AiEditOperation[], timeline: ProjectTimeline): PlanAnalysis {
    const summaryItems: string[] = [];
    const planItems: AiPlanItem[] = [];
    let destructivePrompt: string | null = null;

    let silenceCount = 0;
    let trimCount = 0;
    let transitionCount = 0;
    let speedValue: number | null = null;
    let hasCaptions = false;
    let hasAudio = false;
    let hasAspectChange: string | null = null;

    for (let i = 0; i < operations.length; i++) {
      const op = operations[i];
      const id = `plan_${i}_${op.type}`;

      switch (op.type) {
        case 'REMOVE_SILENCE':
          silenceCount++;
          planItems.push({
            id,
            description: `Remove silent pauses (below ${op.thresholdDb || -35}dB)`,
            opType: 'REMOVE_SILENCE',
          });
          break;

        case 'TRIM': {
          trimCount++;
          const target = op.clipId ? timeline.clips.find((c) => c.id === op.clipId) : timeline.clips[op.clipIndex ?? 0];
          const clipName = target ? target.name : 'clip';
          const start = op.newStartTrimMs ?? op.startMs ?? 0;
          const end = op.newEndTrimMs ?? op.endMs ?? 5000;

          // Check if trimming cuts off the first 5+ seconds
          if (target && start - target.startTrimMs >= 5000) {
            destructivePrompt = `Trim the first ${Math.round((start - target.startTrimMs) / 1000)}s of "${clipName}"?`;
          }

          planItems.push({
            id,
            description: `Trim ${clipName} to ${Math.round(start / 1000)}s - ${Math.round(end / 1000)}s`,
            opType: 'TRIM',
            isDestructive: start - (target?.startTrimMs || 0) >= 5000,
          });
          break;
        }

        case 'DELETE': {
          const target = op.clipId ? timeline.clips.find((c) => c.id === op.clipId) : timeline.clips[op.clipIndex ?? 0];
          const clipName = target ? target.name : 'selected clip';
          destructivePrompt = `Delete clip "${clipName}"?`;
          planItems.push({
            id,
            description: `Delete clip "${clipName}"`,
            opType: 'DELETE',
            isDestructive: true,
          });
          break;
        }

        case 'SPEED': {
          const spd = op.speed ?? op.value ?? 1.0;
          speedValue = spd;
          planItems.push({
            id,
            description: `Apply ${spd}x playback pacing`,
            opType: 'SPEED',
          });
          break;
        }

        case 'CAPTION':
        case 'ADD_CAPTIONS':
          hasCaptions = true;
          planItems.push({
            id,
            description: op.captionText ? `Add animated captions: "${op.captionText}"` : 'Add dynamic viral captions',
            opType: 'CAPTION',
          });
          break;

        case 'AUDIO':
        case 'ADD_AUDIO':
        case 'BEAT_SYNC':
          hasAudio = true;
          planItems.push({
            id,
            description: `Synchronize ${op.genre || op.audioVibe || 'viral'} background soundtrack`,
            opType: 'AUDIO',
          });
          break;

        case 'TRANSITION':
          transitionCount++;
          planItems.push({
            id,
            description: `Add ${op.transition || 'fade'} transition`,
            opType: 'TRANSITION',
          });
          break;

        case 'CHANGE_ASPECT_RATIO':
        case 'ASPECT_RATIO':
          hasAspectChange = op.aspectRatio || '9:16';
          planItems.push({
            id,
            description: `Switch project canvas to ${hasAspectChange}`,
            opType: 'CHANGE_ASPECT_RATIO',
          });
          break;

        case 'SPLIT': {
          const splitSec = Math.round((op.splitAtMs ?? 2000) / 1000);
          planItems.push({
            id,
            description: `Split clip at ${splitSec}s mark`,
            opType: 'SPLIT',
          });
          break;
        }

        case 'FILTER':
          planItems.push({
            id,
            description: `Apply ${op.filter || 'vibrant'} color grade`,
            opType: 'FILTER',
          });
          break;

        case 'ROTATE': {
          const deg = op.rotation ?? op.degrees ?? 90;
          planItems.push({
            id,
            description: `Rotate clip by ${deg}°`,
            opType: 'ROTATE',
          });
          break;
        }

        case 'CROP':
          planItems.push({
            id,
            description: `Apply custom framing crop (${op.crop?.width || 100}%x${op.crop?.height || 100}%)`,
            opType: 'CROP',
          });
          break;

        case 'MOVE':
        case 'MOVE_CLIP': {
          const from = (op.fromIndex ?? 0) + 1;
          const to = (op.toIndex ?? 0) + 1;
          planItems.push({
            id,
            description: `Move clip from position ${from} to ${to}`,
            opType: 'MOVE',
          });
          break;
        }

        case 'DUPLICATE':
          planItems.push({
            id,
            description: 'Duplicate clip segment',
            opType: 'DUPLICATE',
          });
          break;

        case 'MUTE':
          planItems.push({
            id,
            description: op.isMuted || op.muted ? 'Mute clip audio' : 'Unmute clip audio',
            opType: 'MUTE',
          });
          break;

        case 'CREATE_REEL':
          planItems.push({
            id,
            description: `Auto-assemble viral reel (${op.preset || 'Viral Reel'})`,
            opType: 'CREATE_REEL',
          });
          break;

        default:
          planItems.push({
            id,
            description: `Execute ${op.type} operation`,
            opType: op.type,
          });
      }
    }

    // Build consolidated summary bullets matching requirement 9:
    // ✓ Remove 4 silent sections
    // ✓ Trim 3 clips
    // ✓ Add dynamic captions
    // ✓ Apply 1.1x pacing
    // ✓ Add 2 transitions
    if (silenceCount > 0) {
      summaryItems.push(`Remove ${silenceCount} silent ${silenceCount === 1 ? 'section' : 'sections'}`);
    }
    if (trimCount > 0) {
      summaryItems.push(`Trim ${trimCount} ${trimCount === 1 ? 'clip' : 'clips'}`);
    }
    if (hasCaptions) {
      summaryItems.push('Add dynamic captions');
    }
    if (speedValue && speedValue !== 1.0) {
      summaryItems.push(`Apply ${speedValue}x pacing`);
    }
    if (transitionCount > 0) {
      summaryItems.push(`Add ${transitionCount} ${transitionCount === 1 ? 'transition' : 'transitions'}`);
    }
    if (hasAudio) {
      summaryItems.push('Synchronize background audio & auto-ducking');
    }
    if (hasAspectChange) {
      summaryItems.push(`Convert format to ${hasAspectChange}`);
    }

    // Calculate approximate resulting duration
    let totalMs = 0;
    const speed = speedValue || 1.0;
    timeline.clips.forEach((c) => {
      totalMs += (c.endTrimMs - c.startTrimMs) / (c.speed || 1.0);
    });
    const estimatedDurationMs = Math.max(3000, Math.round(totalMs / (speed !== 1.0 ? speed : 1.0)));

    return {
      summaryItems,
      planItems,
      destructivePrompt,
      estimatedDurationMs,
    };
  }

  /**
   * Generates preset-specific operations for the 9 distinct Reel Maker presets.
   */
  static getPresetConfig(preset: ReelPreset): {
    aspectRatio: '9:16' | '1:1' | '16:9';
    filter: 'vibrant' | 'cinematic' | 'warm_vintage' | 'noir' | 'golden_hour';
    speed: number;
    genre: 'phonk' | 'lofi' | 'cinematic' | 'ambient';
    targetDurationSec: number;
    hookStyle: string;
    captionStyle: string;
  } {
    switch (preset) {
      case 'Viral Reel':
        return {
          aspectRatio: '9:16',
          filter: 'vibrant',
          speed: 1.2,
          genre: 'phonk',
          targetDurationSec: 15,
          hookStyle: 'STOP SCROLLING ⚠️',
          captionStyle: 'yellow_viral',
        };
      case 'Educational':
        return {
          aspectRatio: '9:16',
          filter: 'vibrant',
          speed: 1.1,
          genre: 'lofi',
          targetDurationSec: 30,
          hookStyle: 'Did you know this? 💡',
          captionStyle: 'clean_glass',
        };
      case 'Pharma':
        return {
          aspectRatio: '9:16',
          filter: 'golden_hour',
          speed: 1.0,
          genre: 'ambient',
          targetDurationSec: 30,
          hookStyle: 'Important Health Insight 🩺',
          captionStyle: 'clean_glass',
        };
      case 'Travel':
        return {
          aspectRatio: '9:16',
          filter: 'cinematic',
          speed: 1.05,
          genre: 'ambient',
          targetDurationSec: 30,
          hookStyle: 'Hidden Paradise Unlocked ✈️',
          captionStyle: 'clean_glass',
        };
      case 'Business':
        return {
          aspectRatio: '9:16',
          filter: 'golden_hour',
          speed: 1.1,
          genre: 'lofi',
          targetDurationSec: 30,
          hookStyle: 'How Top Founders Scale 📈',
          captionStyle: 'minimal_dark',
        };
      case 'Motivation':
        return {
          aspectRatio: '9:16',
          filter: 'noir',
          speed: 1.15,
          genre: 'cinematic',
          targetDurationSec: 20,
          hookStyle: 'No Excuses. Day One. ⚡️',
          captionStyle: 'yellow_viral',
        };
      case 'Product':
        return {
          aspectRatio: '9:16',
          filter: 'vibrant',
          speed: 1.15,
          genre: 'phonk',
          targetDurationSec: 15,
          hookStyle: 'The Upgrade You Needed 🔥',
          captionStyle: 'comic_pop',
        };
      case 'YouTube Short':
        return {
          aspectRatio: '9:16',
          filter: 'vibrant',
          speed: 1.15,
          genre: 'phonk',
          targetDurationSec: 30,
          hookStyle: 'You Won’t Believe What Happened 🤯',
          captionStyle: 'yellow_viral',
        };
      case 'Instagram Reel':
      default:
        return {
          aspectRatio: '9:16',
          filter: 'golden_hour',
          speed: 1.15,
          genre: 'lofi',
          targetDurationSec: 20,
          hookStyle: 'Save this for your next project ✨',
          captionStyle: 'yellow_viral',
        };
    }
  }
}
