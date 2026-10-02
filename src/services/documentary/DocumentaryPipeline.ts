import {
  createDocumentaryPlan,
} from '../../core/documentary/DocumentaryDirector';
import type {
  DocumentaryPlan,
  DocumentaryTopic,
} from '../../types/DocumentaryMode';

export interface DocumentaryPipelineResult {
  status: 'ready' | 'blocked';
  plan?: DocumentaryPlan;
  validation?: string[];
}

export function prepareDocumentary(input: {
  prompt: string;
  topic: DocumentaryTopic;
  title?: string;
  durationSeconds?: number;
}): DocumentaryPipelineResult {
  if (!input.prompt.trim()) {
    return {
      status: 'blocked',
      validation: ['Documentary subject is required.'],
    };
  }

  const plan = createDocumentaryPlan(input);

  const validation: string[] = [];

  if (!plan.scenes.length) {
    validation.push('No documentary scenes were created.');
  }

  for (const scene of plan.scenes) {
    if (!scene.narration.trim()) {
      validation.push(`${scene.id}: narration missing`);
    }

    if (!scene.visualPrompt.trim()) {
      validation.push(`${scene.id}: visual prompt missing`);
    }
  }

  if (validation.length) {
    return { status: 'blocked', validation };
  }

  return {
    status: 'ready',
    plan,
  };
}
