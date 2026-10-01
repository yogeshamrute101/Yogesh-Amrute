import {
  FullStackPlan,
  FullStackLayer,
  FullStackOperation,
} from './FullStackTypes';
import { understandFullStackPrompt } from './FullStackUnderstandingEngine';

export function planFullStackPrompt(
  prompt: string
): FullStackPlan {
  const intent = understandFullStackPrompt(prompt);

  const steps = intent.layers.flatMap((layer, layerIndex) =>
    intent.operations.map((operation, operationIndex) => ({
      id: `fs_${layerIndex}_${operationIndex}`,
      layer,
      operation,
      description:
        `${operation} ${layer} implementation for: ${intent.goal}`,
      files: [],
      verification: [
        'TypeScript validation',
        'Runtime/API verification',
      ],
    }))
  );

  return {
    intent,
    steps,
    requiresConfirmation: false,
  };
}
