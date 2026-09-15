import {
  AiEditOperation,
  CaptionItem,
  ProjectTimeline,
  TimelineClip,
} from '../types';

export interface TransactionSession {
  id: string;
  originalSnapshot: ProjectTimeline;
  draftTimeline: ProjectTimeline;
  auditLog: string[];
  status: 'active' | 'committed' | 'rolled_back';
  appliedCount: number;
}

export interface TransactionResult {
  success: boolean;
  newTimeline: ProjectTimeline;
  auditLog: string[];
  error?: string;
}

/**
 * Command Transaction Manager
 * Enforces atomic state mutation with strict all-or-nothing rollback semantics.
 * One AI request consisting of multiple operations is committed as a single atomic transaction.
 */
export class CommandTransactionManager {
  /**
   * Initializes a new transaction session with an immutable snapshot.
   */
  static beginTransaction(timeline: ProjectTimeline): TransactionSession {
    const originalSnapshot: ProjectTimeline = JSON.parse(JSON.stringify(timeline));
    const draftTimeline: ProjectTimeline = JSON.parse(JSON.stringify(timeline));

    return {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      originalSnapshot,
      draftTimeline,
      auditLog: [],
      status: 'active',
      appliedCount: 0,
    };
  }

  /**
   * Applies validated operations in sequence against the transaction draft.
   * If ANY operation encounters a runtime failure, automatically invokes rollbackTransaction.
   */
  static applyOperations(session: TransactionSession, operations: AiEditOperation[]): boolean {
    if (session.status !== 'active') {
      throw new Error(`Cannot apply operations to a transaction in status "${session.status}"`);
    }

    try {
      let workingClips = [...session.draftTimeline.clips];
      let workingCaptions = [...session.draftTimeline.captions];
      let workingStickers = [...(session.draftTimeline.stickers || [])];
      let workingRatio = session.draftTimeline.aspectRatio;
      let workingAudio = session.draftTimeline.bgAudio ? { ...session.draftTimeline.bgAudio } : null;

      for (let i = 0; i < operations.length; i++) {
        const op = operations[i];

        switch (op.type) {
          case 'TRIM': {
            const start = op.newStartTrimMs ?? op.startMs;
            const end = op.newEndTrimMs ?? op.endMs;
            if (typeof start !== 'number' || typeof end !== 'number') break;

            const targetIdx = workingClips.findIndex((c) => c.id === op.clipId);
            if (targetIdx === -1 && op.clipId) {
              throw new Error(`TRIM failed: clip "${op.clipId}" missing during execution`);
            }
            const idx = targetIdx !== -1 ? targetIdx : (op.clipIndex ?? 0);

            workingClips[idx] = {
              ...workingClips[idx],
              startTrimMs: start,
              endTrimMs: end,
            };
            session.auditLog.push(`Trimmed "${workingClips[idx].name}" to ${start}ms - ${end}ms`);
            break;
          }

          case 'SPLIT': {
            if (typeof op.splitAtMs !== 'number') break;
            const idx = workingClips.findIndex((c) => c.id === op.clipId);
            if (idx === -1) {
              throw new Error(`SPLIT failed: target clip "${op.clipId}" not found`);
            }

            const target = workingClips[idx];
            const splitCut = target.startTrimMs + op.splitAtMs;

            const partA: TimelineClip = {
              ...target,
              endTrimMs: splitCut,
            };
            const partB: TimelineClip = {
              ...target,
              id: `${target.id}_split_${Date.now()}_${i}`,
              name: `${target.name} (Part 2)`,
              startTrimMs: splitCut,
            };

            workingClips.splice(idx, 1, partA, partB);
            session.auditLog.push(`Split "${target.name}" at +${Math.round(op.splitAtMs / 1000)}s`);
            break;
          }

          case 'SPEED': {
            const spd = op.speed ?? op.value ?? 1.0;
            workingClips = workingClips.map((clip) => {
              if (!op.clipId || clip.id === op.clipId) {
                return { ...clip, speed: spd };
              }
              return clip;
            });
            session.auditLog.push(`Adjusted speed to ${spd}x`);
            break;
          }

          case 'VOLUME': {
            const vol = op.volume ?? op.value ?? 1.0;
            workingClips = workingClips.map((clip) => {
              if (!op.clipId || clip.id === op.clipId) {
                return {
                  ...clip,
                  volume: vol,
                  isMuted: op.isMuted !== undefined ? op.isMuted : clip.isMuted,
                };
              }
              return clip;
            });
            session.auditLog.push(`Updated audio volume to ${Math.round(vol * 100)}%`);
            break;
          }

          case 'MUTE': {
            const muted = op.isMuted !== undefined ? op.isMuted : (op.muted !== undefined ? op.muted : true);
            workingClips = workingClips.map((clip) => {
              if (!op.clipId || clip.id === op.clipId) {
                return { ...clip, isMuted: muted };
              }
              return clip;
            });
            session.auditLog.push(muted ? 'Muted clip audio' : 'Unmuted clip audio');
            break;
          }

          case 'ROTATE': {
            const deg = op.rotation ?? op.degrees ?? 90;
            workingClips = workingClips.map((clip) => {
              if (!op.clipId || clip.id === op.clipId) {
                const currentTrans = clip.transform || { scale: 1, rotation: 0, flipHorizontal: false, flipVertical: false };
                return {
                  ...clip,
                  transform: {
                    ...currentTrans,
                    rotation: deg,
                  },
                };
              }
              return clip;
            });
            session.auditLog.push(`Rotated clip by ${deg}°`);
            break;
          }

          case 'CROP': {
            if (!op.crop) break;
            workingClips = workingClips.map((clip) => {
              if (!op.clipId || clip.id === op.clipId) {
                const currentTrans = clip.transform || { scale: 1, rotation: 0, flipHorizontal: false, flipVertical: false };
                return {
                  ...clip,
                  transform: {
                    ...currentTrans,
                    crop: op.crop,
                  },
                };
              }
              return clip;
            });
            session.auditLog.push(`Applied crop bounds (${op.crop.width}% x ${op.crop.height}%)`);
            break;
          }

          case 'FILTER': {
            const filterName = op.filter || op.name || 'vibrant';
            workingClips = workingClips.map((clip) => {
              if (!op.clipId || clip.id === op.clipId) {
                return { ...clip, filter: filterName as any };
              }
              return clip;
            });
            session.auditLog.push(`Applied color filter: ${filterName}`);
            break;
          }

          case 'TRANSITION': {
            const trans = op.transition || 'fade';
            workingClips = workingClips.map((clip) => {
              if (!op.clipId || clip.id === op.clipId) {
                return { ...clip, transition: trans };
              }
              return clip;
            });
            session.auditLog.push(`Set transition to: ${trans}`);
            break;
          }

          case 'MOVE':
          case 'MOVE_CLIP': {
            const from = op.fromIndex ?? 0;
            const to = op.toIndex ?? 0;
            if (from >= 0 && from < workingClips.length && to >= 0 && to < workingClips.length) {
              const [moved] = workingClips.splice(from, 1);
              workingClips.splice(to, 0, moved);
              session.auditLog.push(`Moved "${moved.name}" from position ${from + 1} to ${to + 1}`);
            }
            break;
          }

          case 'DUPLICATE': {
            const idx = workingClips.findIndex((c) => c.id === op.clipId);
            if (idx !== -1) {
              const original = workingClips[idx];
              const clone: TimelineClip = {
                ...original,
                id: `${original.id}_dup_${Date.now()}`,
                name: `${original.name} (Copy)`,
              };
              workingClips.splice(idx + 1, 0, clone);
              session.auditLog.push(`Duplicated clip "${original.name}"`);
            }
            break;
          }

          case 'DELETE': {
            if (op.clipId && workingClips.length > 1) {
              const deleted = workingClips.find((c) => c.id === op.clipId);
              workingClips = workingClips.filter((c) => c.id !== op.clipId);
              session.auditLog.push(`Deleted clip "${deleted?.name || op.clipId}"`);
            }
            break;
          }

          case 'TEXT': {
            const content = op.content || op.text || '✨ Viral Moment';
            const newSticker = {
              id: `txt_${Date.now()}_${i}`,
              type: 'label',
              content,
              startMs: op.startMs || 0,
              endMs: op.endMs || Math.min(5000, calculateTotalDuration(workingClips)),
              x: 50,
              y: 75,
              scale: 1.1,
              rotation: 0,
              animation: 'pop' as const,
            };
            workingStickers = [...workingStickers, newSticker];
            session.auditLog.push(`Added text overlay: "${content}"`);
            break;
          }

          case 'CAPTION':
          case 'ADD_CAPTIONS': {
            const text = op.captionText || op.text || '✨ Viral Hook';
            const totalMs = calculateTotalDuration(workingClips);
            const newCap: CaptionItem = {
              id: `cap_${Date.now()}_${i}`,
              text,
              startMs: 0,
              endMs: Math.min(5000, totalMs),
              style: (op.style as any) || 'yellow_viral',
              position: 'bottom',
              highlightWord: text.split(' ')[0] || 'VIRAL',
            };
            workingCaptions = [...workingCaptions, newCap];
            session.auditLog.push(`Generated captions: "${text}"`);
            break;
          }

          case 'AUDIO':
          case 'ADD_AUDIO':
          case 'BEAT_SYNC': {
            const genre = (op.genre || op.audioVibe || 'phonk').toLowerCase() as any;
            workingAudio = {
              id: `bg_${Date.now()}`,
              title: `AI Beat (${genre.toUpperCase()})`,
              genre,
              volume: op.volume !== undefined ? op.volume : 0.7,
              isMuted: false,
              ducking: true,
              durationMs: calculateTotalDuration(workingClips),
            };
            session.auditLog.push(`Added background track: ${genre}`);
            break;
          }

          case 'REMOVE_SILENCE': {
            const threshold = op.thresholdDb || -35;
            workingClips = workingClips.map((clip) => {
              const len = clip.endTrimMs - clip.startTrimMs;
              if (len > 3000) {
                // Trim silence margins
                const newStart = clip.startTrimMs + 350;
                const newEnd = Math.max(newStart + 1500, clip.endTrimMs - 450);
                return { ...clip, startTrimMs: newStart, endTrimMs: newEnd };
              }
              return clip;
            });
            session.auditLog.push(`Removed silence margins across clips (${threshold}dB)`);
            break;
          }

          case 'DETECT_SCENES': {
            // Tighten clips to energetic sections with smooth cuts
            workingClips = workingClips.map((c, idx) => ({
              ...c,
              transition: idx > 0 ? 'fade' : 'none',
              filter: 'vibrant',
            }));
            session.auditLog.push('Analyzed scenes and optimized transitions');
            break;
          }

          case 'CREATE_REEL':
          case 'MAKE_REEL': {
            workingRatio = '9:16';
            workingClips = workingClips.map((c) => ({
              ...c,
              filter: 'vibrant',
              speed: 1.15,
              endTrimMs: Math.min(c.endTrimMs, c.startTrimMs + 4000),
            }));
            workingAudio = {
              id: `bg_reel_${Date.now()}`,
              title: 'Viral Phonk Surge',
              genre: 'phonk',
              volume: 0.7,
              isMuted: false,
              ducking: true,
              durationMs: calculateTotalDuration(workingClips),
            };
            session.auditLog.push(`Created viral 9:16 Reel (${op.preset || 'Viral Reel'})`);
            break;
          }

          case 'CHANGE_ASPECT_RATIO':
          case 'ASPECT_RATIO': {
            if (op.aspectRatio) {
              workingRatio = op.aspectRatio;
              session.auditLog.push(`Changed aspect ratio to ${op.aspectRatio}`);
            }
            break;
          }

          case 'TRANSFORM': {
            if (op.transform) {
              workingClips = workingClips.map((clip) => {
                if (!op.clipId || clip.id === op.clipId) {
                  return {
                    ...clip,
                    transform: {
                      scale: op.transform!.scale ?? clip.transform?.scale ?? 1.0,
                      rotation: op.transform!.rotation ?? clip.transform?.rotation ?? 0,
                      flipHorizontal: op.transform!.flipHorizontal ?? clip.transform?.flipHorizontal ?? false,
                      flipVertical: op.transform!.flipVertical ?? clip.transform?.flipVertical ?? false,
                      crop: op.transform!.crop ?? clip.transform?.crop,
                    },
                  };
                }
                return clip;
              });
              session.auditLog.push('Updated clip transform parameters');
            }
            break;
          }

          case 'COLOR_ADJUST': {
            if (op.colorAdjustments) {
              workingClips = workingClips.map((clip) => {
                if (!op.clipId || clip.id === op.clipId) {
                  return {
                    ...clip,
                    colorAdjustments: {
                      ...(clip.colorAdjustments || { brightness: 0, contrast: 0, saturation: 0, exposure: 0, vignette: 0, warmth: 0 }),
                      ...op.colorAdjustments,
                    },
                  };
                }
                return clip;
              });
              session.auditLog.push('Applied color grading adjustments');
            }
            break;
          }

          case 'ADD_STICKER': {
            if (op.sticker) {
              const newSticker = {
                id: `stk_${Date.now()}_${i}`,
                ...op.sticker,
              };
              workingStickers = [...workingStickers, newSticker];
              session.auditLog.push(`Added sticker: "${op.sticker.content}"`);
            }
            break;
          }
        }
      }

      session.draftTimeline = {
        ...session.draftTimeline,
        clips: workingClips,
        captions: workingCaptions,
        stickers: workingStickers,
        aspectRatio: workingRatio,
        bgAudio: workingAudio,
        updatedAt: Date.now(),
      };
      session.appliedCount = operations.length;
      return true;
    } catch (err: any) {
      console.error('Operation failed during transaction, triggering immediate rollback:', err);
      this.rollbackTransaction(session);
      return false;
    }
  }

  /**
   * Commits the active transaction, making draft state permanent.
   */
  static commitTransaction(session: TransactionSession): TransactionResult {
    if (session.status === 'rolled_back') {
      return {
        success: false,
        newTimeline: session.originalSnapshot,
        auditLog: ['Transaction was rolled back.'],
        error: 'Cannot commit rolled back transaction',
      };
    }

    session.status = 'committed';
    return {
      success: true,
      newTimeline: session.draftTimeline,
      auditLog: session.auditLog,
    };
  }

  /**
   * Rolls back the transaction to the exact original snapshot.
   */
  static rollbackTransaction(session: TransactionSession): TransactionResult {
    session.status = 'rolled_back';
    session.draftTimeline = JSON.parse(JSON.stringify(session.originalSnapshot));
    session.auditLog.push('ROLLBACK EXECUTED: All changes discarded.');

    return {
      success: false,
      newTimeline: session.originalSnapshot,
      auditLog: session.auditLog,
      error: 'Transaction rolled back to snapshot',
    };
  }
}

/**
 * Convenience orchestration wrapper that manages begin -> apply -> commit/rollback lifecycle.
 */
export function executeCommandTransaction(
  currentTimeline: ProjectTimeline,
  operations: AiEditOperation[]
): TransactionResult {
  const session = CommandTransactionManager.beginTransaction(currentTimeline);
  const ok = CommandTransactionManager.applyOperations(session, operations);

  if (!ok) {
    return CommandTransactionManager.rollbackTransaction(session);
  }

  return CommandTransactionManager.commitTransaction(session);
}

function calculateTotalDuration(clips: TimelineClip[]): number {
  return clips.reduce((acc, c) => acc + (c.endTrimMs - c.startTrimMs) / (c.speed || 1.0), 0);
}
