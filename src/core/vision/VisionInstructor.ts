import {
  VisionFrameInput,
  VisionInstructorResult,
  VisionUnderstanding,
} from './VisionInstructorTypes';

function clamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export class VisionInstructor {
  understand(input: VisionFrameInput): VisionUnderstanding {
    if (input.permission !== 'granted') {
      return {
        state: 'unknown',
        confidence: 0,
        signals: [],
        explanation: 'Camera permission is not available.',
        requiresConfirmation: true,
      };
    }

    const state = input.state ?? 'unknown';
    const confidence = clamp(input.confidence ?? 0);

    return {
      state,
      confidence,
      signals: input.signals ?? [],
      explanation:
        state === 'unknown'
          ? 'Visual cues are insufficient for a reliable interpretation.'
          : `Visual cues suggest: ${state}.`,
      requiresConfirmation:
        confidence < 0.75 ||
        state === 'possibly-confused' ||
        state === 'possibly-tired' ||
        state === 'possibly-distracted',
    };
  }

  process(input: VisionFrameInput): VisionInstructorResult {
    if (input.permission !== 'granted') {
      return {
        status: 'permission-required',
        understanding: this.understand(input),
        suggestedActions: [],
        verified: false,
      };
    }

    const understanding = this.understand(input);
    const suggestedActions: string[] = [];

    if (understanding.state === 'possibly-confused') {
      suggestedActions.push('offer-help');
    }

    if (understanding.state === 'possibly-tired') {
      suggestedActions.push('offer-break-or-simplify');
    }

    if (understanding.state === 'possibly-distracted') {
      suggestedActions.push('reduce-distractions');
    }

    return {
      status: input.signals?.length ? 'ready' : 'insufficient-data',
      understanding,
      suggestedActions,
      verified: false,
    };
  }
}
