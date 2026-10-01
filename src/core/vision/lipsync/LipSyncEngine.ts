import {
  LipSyncInput,
  LipSyncResult,
  MouthFrame,
  SpeechFrame,
} from './LipSyncTypes';

function clamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export class LipSyncEngine {
  analyze(input: LipSyncInput): LipSyncResult {
    const mouthFrames: MouthFrame[] = input.mouthFrames ?? [];
    const speechFrames: SpeechFrame[] = input.speechFrames ?? [];

    const movementDetected = mouthFrames.some(
      frame =>
        frame.signal === 'mouth-moving' ||
        frame.signal === 'mouth-open'
    );

    if (!mouthFrames.length) {
      return {
        status: 'insufficient-data',
        movementDetected: false,
        synchronizationScore: 0,
        mouthFrames: [],
        speechFrames,
        explanation: 'No mouth movement frames were provided.',
        verified: false,
      };
    }

    if (!speechFrames.length) {
      return {
        status: 'audio-required',
        movementDetected,
        synchronizationScore: 0,
        mouthFrames,
        speechFrames: [],
        explanation:
          'Mouth movement was detected, but audio/speech timing is required for lip-sync verification.',
        verified: false,
      };
    }

    let matches = 0;

    for (const speech of speechFrames) {
      const nearby = mouthFrames.some(
        mouth =>
          Math.abs(mouth.timestampMs - speech.timestampMs) <= 180 &&
          (mouth.signal === 'mouth-moving' ||
            mouth.signal === 'mouth-open')
      );

      if (nearby) matches++;
    }

    const score = speechFrames.length
      ? clamp(matches / speechFrames.length)
      : 0;

    return {
      status: score >= 0.75 ? 'synced' : 'desynced',
      movementDetected,
      synchronizationScore: score,
      mouthFrames,
      speechFrames,
      explanation:
        score >= 0.75
          ? 'Visual mouth movement and speech timing are reasonably aligned.'
          : 'Visual mouth movement and speech timing need adjustment.',
      verified: score >= 0.75,
    };
  }
}
