import {
  MasterMultimodalDecision,
  MasterMultimodalInput,
} from './MasterMultimodalTypes';

export class MasterMultimodalInstructor {
  decide(input: MasterMultimodalInput): MasterMultimodalDecision {
    const signals = input.signals ?? [];
    const instruction = (input.userInstruction ?? '').trim();

    const cameraAvailable =
      input.cameraPermission === 'granted' &&
      signals.includes('camera');

    const confirmationRequired =
      signals.includes('gaze') ||
      signals.includes('mouth') ||
      signals.includes('gesture');

    return {
      intent: instruction || 'observe-and-assist',
      signalsUsed: signals,
      actionRequired: Boolean(instruction),
      confirmationRequired: !cameraAvailable || confirmationRequired,
      explanation: cameraAvailable
        ? 'Multimodal signals are available to assist the Master Instructor.'
        : 'Explicit camera permission and sufficient visual data are required before camera-based assistance.',
    };
  }
}
