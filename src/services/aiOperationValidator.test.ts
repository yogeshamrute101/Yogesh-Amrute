import { test, describe } from 'node:test';
import assert from 'node:assert';
import { validateAiOperations } from './aiOperationValidator';
import { ProjectTimeline, TimelineClip, AiEditOperation } from '../types';

describe('validateAiOperations', () => {
  const createMockClip = (id: string, startMs: number, endMs: number): TimelineClip => ({
    id,
    assetId: `asset-${id}`,
    startTrimMs: startMs,
    endTrimMs: endMs,
    originalDurationMs: endMs,
    type: 'video',
    name: `Mock Clip ${id}`,
  });

  const createMockTimeline = (clips: TimelineClip[] = []): ProjectTimeline => ({
    id: 'timeline-1',
    projectId: 'project-1',
    clips,
    aspectRatio: '9:16',
    globalFilter: 'none',
  });

  test('returns invalid for non-array or empty operations', () => {
    const timeline = createMockTimeline([createMockClip('c1', 0, 10000)]);

    // @ts-expect-error Testing invalid input
    let result = validateAiOperations(null, timeline);
    assert.strictEqual(result.isValid, false);
    assert.strictEqual(result.warnings.length, 1);
    assert.match(result.warnings[0], /No operations provided/);

    result = validateAiOperations([], timeline);
    assert.strictEqual(result.isValid, false);
    assert.match(result.warnings[0], /No operations provided/);
  });

  test('returns invalid if operations count exceeds max limit', () => {
    const timeline = createMockTimeline([createMockClip('c1', 0, 10000)]);
    const rawOps: AiEditOperation[] = Array.from({ length: 31 }, (_, i) => ({ type: 'DELETE', clipIndex: i }));

    const result = validateAiOperations(rawOps, timeline);
    assert.strictEqual(result.isValid, false);
    assert.match(result.warnings[0], /exceeds safe limit/);
  });

  test('returns invalid if timeline has no clips collection', () => {
    // @ts-expect-error Testing invalid input
    const invalidTimeline: ProjectTimeline = { id: 'timeline-1' };
    const rawOps: AiEditOperation[] = [{ type: 'DELETE', clipId: 'c1' }];

    const result = validateAiOperations(rawOps, invalidTimeline);
    assert.strictEqual(result.isValid, false);
    assert.match(result.warnings[0], /invalid clips collection/);
  });
});

describe('validateAiOperations - Clip Resolution & Basic ops', () => {
  const createMockClip = (id: string, startMs: number, endMs: number): TimelineClip => ({
    id,
    assetId: `asset-${id}`,
    startTrimMs: startMs,
    endTrimMs: endMs,
    originalDurationMs: endMs,
    type: 'video',
    name: `Mock Clip ${id}`,
  });

  const createMockTimeline = (clips: TimelineClip[] = []): ProjectTimeline => ({
    id: 'timeline-1',
    projectId: 'project-1',
    clips,
    aspectRatio: '9:16',
    globalFilter: 'none',
  });

  test('returns invalid if operation is missing type property', () => {
    const timeline = createMockTimeline([createMockClip('c1', 0, 10000)]);
    // @ts-expect-error Testing invalid input
    const rawOps: AiEditOperation[] = [{ clipId: 'c1' }];

    const result = validateAiOperations(rawOps, timeline);
    assert.strictEqual(result.isValid, false);
    assert.match(result.warnings[0], /missing a valid type/);
  });

  test('returns invalid for unsupported operation type', () => {
    const timeline = createMockTimeline([createMockClip('c1', 0, 10000)]);
    // @ts-expect-error Testing invalid input
    const rawOps: AiEditOperation[] = [{ type: 'UNSUPPORTED_TYPE', clipId: 'c1' }];

    const result = validateAiOperations(rawOps, timeline);
    assert.strictEqual(result.isValid, false);
    assert.match(result.warnings[0], /Unsupported operation type/);
  });

  test('clip resolution: uses clipId, falls back to clipIndex, defaults to first clip', () => {
    const timeline = createMockTimeline([
      createMockClip('c1', 0, 10000),
      createMockClip('c2', 0, 10000),
      createMockClip('c3', 0, 10000),
    ]);

    // Test with clipId
    const opId: AiEditOperation = { type: 'MUTE', clipId: 'c2' };
    let result = validateAiOperations([opId], timeline);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.validatedOperations[0].clipId, 'c2');

    // Test with clipIndex
    const opIndex: AiEditOperation = { type: 'MUTE', clipIndex: 2 };
    result = validateAiOperations([opIndex], timeline);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.validatedOperations[0].clipId, 'c3');

    // Test with neither (should default to first clip c1)
    const opNone: AiEditOperation = { type: 'MUTE' };
    result = validateAiOperations([opNone], timeline);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.validatedOperations[0].clipId, 'c1');

    // Test with invalid clipId (fails)
    const opInvalidId: AiEditOperation = { type: 'MUTE', clipId: 'c99' };
    result = validateAiOperations([opInvalidId], timeline);
    assert.strictEqual(result.isValid, false);

    // Test with invalid clipIndex (falls back to null, leading to missing target)
    const opInvalidIndex: AiEditOperation = { type: 'MUTE', clipIndex: 99 };
    result = validateAiOperations([opInvalidIndex], timeline);
    assert.strictEqual(result.isValid, false);
  });
});

describe('validateAiOperations - TRIM, SPLIT, SPEED, VOLUME, MUTE', () => {
  const createMockClip = (id: string, startMs: number, endMs: number): TimelineClip => ({
    id,
    assetId: `asset-${id}`,
    startTrimMs: startMs,
    endTrimMs: endMs,
    originalDurationMs: endMs,
    type: 'video',
    name: `Mock Clip ${id}`,
  });

  const createMockTimeline = (clips: TimelineClip[] = []): ProjectTimeline => ({
    id: 'timeline-1',
    projectId: 'project-1',
    clips,
    aspectRatio: '9:16',
    globalFilter: 'none',
  });

  test('TRIM operation', () => {
    const timeline = createMockTimeline([createMockClip('c1', 0, 10000)]);

    // Valid TRIM
    let result = validateAiOperations([{ type: 'TRIM', clipId: 'c1', startMs: 1000, endMs: 5000 }], timeline);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.validatedOperations[0].startMs, 1000);
    assert.strictEqual(result.validatedOperations[0].endMs, 5000);

    // Negative startMs
    result = validateAiOperations([{ type: 'TRIM', clipId: 'c1', startMs: -500, endMs: 5000 }], timeline);
    assert.strictEqual(result.isValid, false);
    assert.match(result.warnings[0], /Invalid startMs/);

    // endMs <= startMs
    result = validateAiOperations([{ type: 'TRIM', clipId: 'c1', startMs: 5000, endMs: 1000 }], timeline);
    assert.strictEqual(result.isValid, false);
    assert.match(result.warnings[0], /Invalid trim bounds/);

    // endMs > sourceDuration + 10
    result = validateAiOperations([{ type: 'TRIM', clipId: 'c1', startMs: 0, endMs: 20000 }], timeline);
    assert.strictEqual(result.isValid, false);
    assert.match(result.warnings[0], /Trim end/);

    // Missing target
    result = validateAiOperations([{ type: 'TRIM', clipId: 'c99', startMs: 1000, endMs: 5000 }], timeline);
    assert.strictEqual(result.isValid, false);
    assert.match(result.warnings[0], /not found in current timeline/);
  });

  test('SPLIT operation', () => {
    const timeline = createMockTimeline([createMockClip('c1', 0, 10000)]);

    // Valid SPLIT
    let result = validateAiOperations([{ type: 'SPLIT', clipId: 'c1', splitAtMs: 5000 }], timeline);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.validatedOperations[0].splitAtMs, 5000);

    // Invalid splitAtMs (negative)
    result = validateAiOperations([{ type: 'SPLIT', clipId: 'c1', splitAtMs: -100 }], timeline);
    assert.strictEqual(result.isValid, false);
    assert.match(result.warnings[0], /Invalid splitAtMs/);

    // Invalid splitAtMs (beyond duration)
    result = validateAiOperations([{ type: 'SPLIT', clipId: 'c1', splitAtMs: 15000 }], timeline);
    assert.strictEqual(result.isValid, false);
    assert.match(result.warnings[0], /Invalid splitAtMs/);

    // Missing target
    result = validateAiOperations([{ type: 'SPLIT', clipId: 'c99', splitAtMs: 5000 }], timeline);
    assert.strictEqual(result.isValid, false);
    assert.match(result.warnings[0], /Target clip for SPLIT not found/);
  });

  test('SPEED operation', () => {
    const timeline = createMockTimeline([createMockClip('c1', 0, 10000)]);

    // Valid SPEED
    let result = validateAiOperations([{ type: 'SPEED', clipId: 'c1', speed: 2.0 }], timeline);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.validatedOperations[0].speed, 2.0);

    // Missing numeric value
    result = validateAiOperations([{ type: 'SPEED', clipId: 'c1', speed: 'fast' as any }], timeline);
    assert.strictEqual(result.isValid, false);
    assert.match(result.warnings[0], /missing valid numeric value/);

    // Out of bounds (< MIN_SPEED)
    result = validateAiOperations([{ type: 'SPEED', clipId: 'c1', speed: 0.1 }], timeline);
    assert.strictEqual(result.isValid, false);
    assert.match(result.warnings[0], /outside supported range/);

    // Out of bounds (> MAX_SPEED)
    result = validateAiOperations([{ type: 'SPEED', clipId: 'c1', speed: 5.0 }], timeline);
    assert.strictEqual(result.isValid, false);
    assert.match(result.warnings[0], /outside supported range/);
  });

  test('VOLUME operation', () => {
    const timeline = createMockTimeline([createMockClip('c1', 0, 10000)]);

    // Valid VOLUME
    let result = validateAiOperations([{ type: 'VOLUME', clipId: 'c1', volume: 0.5 }], timeline);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.validatedOperations[0].volume, 0.5);

    // Missing numeric value
    result = validateAiOperations([{ type: 'VOLUME', clipId: 'c1', volume: 'loud' as any }], timeline);
    assert.strictEqual(result.isValid, false);
    assert.match(result.warnings[0], /missing valid numeric value/);

    // Out of bounds (< MIN_VOLUME)
    result = validateAiOperations([{ type: 'VOLUME', clipId: 'c1', volume: -0.5 }], timeline);
    assert.strictEqual(result.isValid, false);
    assert.match(result.warnings[0], /outside valid range/);

    // Out of bounds (> MAX_VOLUME)
    result = validateAiOperations([{ type: 'VOLUME', clipId: 'c1', volume: 1.5 }], timeline);
    assert.strictEqual(result.isValid, false);
    assert.match(result.warnings[0], /outside valid range/);
  });

  test('MUTE operation', () => {
    const timeline = createMockTimeline([createMockClip('c1', 0, 10000)]);

    // Valid MUTE
    let result = validateAiOperations([{ type: 'MUTE', clipId: 'c1', isMuted: true }], timeline);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.validatedOperations[0].isMuted, true);

    // Missing target
    result = validateAiOperations([{ type: 'MUTE', clipId: 'c99', isMuted: true }], timeline);
    assert.strictEqual(result.isValid, false);
    assert.match(result.warnings[0], /Target clip for MUTE not found/);
  });
});

describe('validateAiOperations - ROTATE, CROP, FILTER, TRANSITION', () => {
  const createMockClip = (id: string, startMs: number, endMs: number): TimelineClip => ({
    id,
    assetId: `asset-${id}`,
    startTrimMs: startMs,
    endTrimMs: endMs,
    originalDurationMs: endMs,
    type: 'video',
    name: `Mock Clip ${id}`,
  });

  const createMockTimeline = (clips: TimelineClip[] = []): ProjectTimeline => ({
    id: 'timeline-1',
    projectId: 'project-1',
    clips,
    aspectRatio: '9:16',
    globalFilter: 'none',
  });

  test('ROTATE operation', () => {
    const timeline = createMockTimeline([createMockClip('c1', 0, 10000)]);

    // Valid ROTATE (90)
    let result = validateAiOperations([{ type: 'ROTATE', clipId: 'c1', rotation: 90 }], timeline);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.validatedOperations[0].rotation, 90);

    // Invalid ROTATE (45)
    result = validateAiOperations([{ type: 'ROTATE', clipId: 'c1', rotation: 45 }], timeline);
    assert.strictEqual(result.isValid, false);
    assert.match(result.warnings[0], /Invalid rotation/);

    // Missing target
    result = validateAiOperations([{ type: 'ROTATE', clipId: 'c99', rotation: 90 }], timeline);
    assert.strictEqual(result.isValid, false);
    assert.match(result.warnings[0], /Target clip for ROTATE not found/);
  });

  test('CROP operation', () => {
    const timeline = createMockTimeline([createMockClip('c1', 0, 10000)]);

    // Valid CROP
    let result = validateAiOperations([{ type: 'CROP', clipId: 'c1', crop: { x: 10, y: 10, width: 50, height: 50 } }], timeline);
    assert.strictEqual(result.isValid, true);
    assert.deepStrictEqual(result.validatedOperations[0].crop, { x: 10, y: 10, width: 50, height: 50 });

    // Missing target
    result = validateAiOperations([{ type: 'CROP', clipId: 'c99', crop: { x: 10, y: 10, width: 50, height: 50 } }], timeline);
    assert.strictEqual(result.isValid, false);
    assert.match(result.warnings[0], /Target clip for CROP not found/);

    // Missing crop object
    result = validateAiOperations([{ type: 'CROP', clipId: 'c1' }], timeline);
    assert.strictEqual(result.isValid, false);
    assert.match(result.warnings[0], /CROP operation missing/);

    // Invalid bounds (x < 0)
    result = validateAiOperations([{ type: 'CROP', clipId: 'c1', crop: { x: -10, y: 10, width: 50, height: 50 } }], timeline);
    assert.strictEqual(result.isValid, false);
    assert.match(result.warnings[0], /Invalid crop boundary/);

    // Invalid bounds (width <= 0)
    result = validateAiOperations([{ type: 'CROP', clipId: 'c1', crop: { x: 10, y: 10, width: 0, height: 50 } }], timeline);
    assert.strictEqual(result.isValid, false);
    assert.match(result.warnings[0], /Invalid crop boundary/);

    // Invalid bounds (x + width > 100)
    result = validateAiOperations([{ type: 'CROP', clipId: 'c1', crop: { x: 60, y: 10, width: 50, height: 50 } }], timeline);
    assert.strictEqual(result.isValid, false);
    assert.match(result.warnings[0], /Invalid crop boundary/);
  });

  test('FILTER operation', () => {
    const timeline = createMockTimeline([createMockClip('c1', 0, 10000)]);

    // Valid FILTER
    let result = validateAiOperations([{ type: 'FILTER', clipId: 'c1', filter: 'vibrant' }], timeline);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.validatedOperations[0].filter, 'vibrant');

    // Unknown FILTER
    result = validateAiOperations([{ type: 'FILTER', clipId: 'c1', filter: 'unknown_filter' as any }], timeline);
    assert.strictEqual(result.isValid, false);
    assert.match(result.warnings[0], /Unknown filter/);
  });

  test('TRANSITION operation', () => {
    const timeline = createMockTimeline([createMockClip('c1', 0, 10000)]);

    // Valid TRANSITION
    let result = validateAiOperations([{ type: 'TRANSITION', clipId: 'c1', transition: 'fade' }], timeline);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.validatedOperations[0].transition, 'fade');

    // Unknown TRANSITION
    result = validateAiOperations([{ type: 'TRANSITION', clipId: 'c1', transition: 'unknown_transition' as any }], timeline);
    assert.strictEqual(result.isValid, false);
    assert.match(result.warnings[0], /Unknown transition/);
  });
});

describe('validateAiOperations - MOVE, DUPLICATE, DELETE, TEXT', () => {
  const createMockClip = (id: string, startMs: number, endMs: number): TimelineClip => ({
    id,
    assetId: `asset-${id}`,
    startTrimMs: startMs,
    endTrimMs: endMs,
    originalDurationMs: endMs,
    type: 'video',
    name: `Mock Clip ${id}`,
  });

  const createMockTimeline = (clips: TimelineClip[] = []): ProjectTimeline => ({
    id: 'timeline-1',
    projectId: 'project-1',
    clips,
    aspectRatio: '9:16',
    globalFilter: 'none',
  });

  test('MOVE operation', () => {
    const timeline = createMockTimeline([
      createMockClip('c1', 0, 10000),
      createMockClip('c2', 0, 10000),
    ]);

    // Valid MOVE
    let result = validateAiOperations([{ type: 'MOVE', fromIndex: 0, toIndex: 1 }], timeline);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.validatedOperations[0].fromIndex, 0);
    assert.strictEqual(result.validatedOperations[0].toIndex, 1);

    // Invalid MOVE (from < 0)
    result = validateAiOperations([{ type: 'MOVE', fromIndex: -1, toIndex: 1 }], timeline);
    assert.strictEqual(result.isValid, false);
    assert.match(result.warnings[0], /indices out of bounds/);

    // Invalid MOVE (to >= timeline.clips.length)
    result = validateAiOperations([{ type: 'MOVE', fromIndex: 0, toIndex: 2 }], timeline);
    assert.strictEqual(result.isValid, false);
    assert.match(result.warnings[0], /indices out of bounds/);
  });

  test('DUPLICATE operation', () => {
    const timeline = createMockTimeline([createMockClip('c1', 0, 10000)]);

    // Valid DUPLICATE
    let result = validateAiOperations([{ type: 'DUPLICATE', clipId: 'c1' }], timeline);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.validatedOperations[0].clipId, 'c1');

    // Missing target
    result = validateAiOperations([{ type: 'DUPLICATE', clipId: 'c99' }], timeline);
    assert.strictEqual(result.isValid, false);
    assert.match(result.warnings[0], /Target clip for DUPLICATE not found/);
  });

  test('DELETE operation', () => {
    const timeline = createMockTimeline([
      createMockClip('c1', 0, 10000),
      createMockClip('c2', 0, 10000),
    ]);

    // Valid DELETE
    let result = validateAiOperations([{ type: 'DELETE', clipId: 'c1' }], timeline);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.validatedOperations[0].clipId, 'c1');

    // Missing target
    result = validateAiOperations([{ type: 'DELETE', clipId: 'c99' }], timeline);
    assert.strictEqual(result.isValid, false);
    assert.match(result.warnings[0], /Target clip for DELETE not found/);

    // Deleting the only clip
    const timelineOneClip = createMockTimeline([createMockClip('c1', 0, 10000)]);
    result = validateAiOperations([{ type: 'DELETE', clipId: 'c1' }], timelineOneClip);
    assert.strictEqual(result.isValid, false);
    assert.match(result.warnings[0], /Cannot delete the only clip/);
  });

  test('TEXT operation', () => {
    const timeline = createMockTimeline([createMockClip('c1', 0, 10000)]);

    // Valid TEXT
    let result = validateAiOperations([{ type: 'TEXT', text: 'Hello', startMs: 0, endMs: 2000 }], timeline);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.validatedOperations[0].text, 'Hello');

    // Missing content
    result = validateAiOperations([{ type: 'TEXT', startMs: 0, endMs: 2000 }], timeline);
    assert.strictEqual(result.isValid, false);
    assert.match(result.warnings[0], /missing text content/);
  });
});

describe('validateAiOperations - Other operations', () => {
  const createMockClip = (id: string, startMs: number, endMs: number): TimelineClip => ({
    id,
    assetId: `asset-${id}`,
    startTrimMs: startMs,
    endTrimMs: endMs,
    originalDurationMs: endMs,
    type: 'video',
    name: `Mock Clip ${id}`,
  });

  const createMockTimeline = (clips: TimelineClip[] = []): ProjectTimeline => ({
    id: 'timeline-1',
    projectId: 'project-1',
    clips,
    aspectRatio: '9:16',
    globalFilter: 'none',
  });

  test('CAPTION operation', () => {
    const timeline = createMockTimeline([createMockClip('c1', 0, 10000)]);
    const result = validateAiOperations([{ type: 'CAPTION', enabled: true }], timeline);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.validatedOperations[0].type, 'CAPTION');
  });

  test('AUDIO operation', () => {
    const timeline = createMockTimeline([createMockClip('c1', 0, 10000)]);
    let result = validateAiOperations([{ type: 'AUDIO', genre: 'lofi', volume: 0.5 }], timeline);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.validatedOperations[0].genre, 'lofi');
    assert.strictEqual(result.validatedOperations[0].volume, 0.5);

    // Default fallback for invalid genre
    result = validateAiOperations([{ type: 'AUDIO', genre: 'unknown_genre' as any }], timeline);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.validatedOperations[0].genre, 'phonk');
  });

  test('REMOVE_SILENCE operation', () => {
    const timeline = createMockTimeline([createMockClip('c1', 0, 10000)]);
    let result = validateAiOperations([{ type: 'REMOVE_SILENCE', thresholdDb: -30 }], timeline);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.validatedOperations[0].thresholdDb, -30);

    // Bounds checking
    result = validateAiOperations([{ type: 'REMOVE_SILENCE', thresholdDb: -10 }], timeline);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.validatedOperations[0].thresholdDb, -15);
  });

  test('DETECT_SCENES operation', () => {
    const timeline = createMockTimeline([createMockClip('c1', 0, 10000)]);
    let result = validateAiOperations([{ type: 'DETECT_SCENES', sensitivity: 0.5 }], timeline);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.validatedOperations[0].sensitivity, 0.5);

    // Bounds checking
    result = validateAiOperations([{ type: 'DETECT_SCENES', sensitivity: 1.5 }], timeline);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.validatedOperations[0].sensitivity, 1.0);
  });

  test('CREATE_REEL operation', () => {
    const timeline = createMockTimeline([createMockClip('c1', 0, 10000)]);
    const result = validateAiOperations([{ type: 'CREATE_REEL', preset: 'Viral Reel', targetDurationSec: 15, genre: 'phonk' }], timeline);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.validatedOperations[0].preset, 'Viral Reel');
  });

  test('CHANGE_ASPECT_RATIO operation', () => {
    const timeline = createMockTimeline([createMockClip('c1', 0, 10000)]);

    // Valid
    let result = validateAiOperations([{ type: 'CHANGE_ASPECT_RATIO', aspectRatio: '1:1' }], timeline);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.validatedOperations[0].aspectRatio, '1:1');

    // Invalid
    result = validateAiOperations([{ type: 'CHANGE_ASPECT_RATIO', aspectRatio: '3:4' as any }], timeline);
    assert.strictEqual(result.isValid, false);
    assert.match(result.warnings[0], /Invalid aspect ratio/);
  });

  test('TRANSFORM operation', () => {
    const timeline = createMockTimeline([createMockClip('c1', 0, 10000)]);
    const result = validateAiOperations([{ type: 'TRANSFORM', clipId: 'c1', transform: { scale: 1.5 } }], timeline);
    assert.strictEqual(result.isValid, true);
    assert.deepStrictEqual(result.validatedOperations[0].transform, { scale: 1.5 });
  });

  test('COLOR_ADJUST operation', () => {
    const timeline = createMockTimeline([createMockClip('c1', 0, 10000)]);
    const result = validateAiOperations([{ type: 'COLOR_ADJUST', clipId: 'c1', colorAdjustments: { brightness: 1.2 } }], timeline);
    assert.strictEqual(result.isValid, true);
    assert.deepStrictEqual(result.validatedOperations[0].colorAdjustments, { brightness: 1.2 });
  });

  test('ADD_STICKER operation', () => {
    const timeline = createMockTimeline([createMockClip('c1', 0, 10000)]);

    // Valid
    let result = validateAiOperations([{ type: 'ADD_STICKER', sticker: { content: 'smile', x: 0, y: 0, scale: 1, rotation: 0 } }], timeline);
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.validatedOperations[0].sticker.content, 'smile');

    // Invalid (missing sticker)
    result = validateAiOperations([{ type: 'ADD_STICKER' }], timeline);
    assert.strictEqual(result.isValid, false);
  });
});
