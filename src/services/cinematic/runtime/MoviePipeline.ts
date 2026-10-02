import { createMoviePlan } from '../planner/MoviePlanner';
import {
  applyContinuity,
  createContinuityState,
} from '../continuity/ContinuityEngine';
import { createVoiceProfile } from '../continuity/VoiceContinuity';
import type {
  MoviePlan,
  PipelineResult,
} from '../../../types/CinematicPipeline';

export function prepareMoviePipeline(input: {
  prompt: string;
  subject?: string;
  role?: string;
  durationSeconds?: number;
  aspectRatio?: string;
}): PipelineResult {
  if (!input.prompt.trim()) {
    return {
      stage: 'planner',
      status: 'blocked',
      message: 'Movie prompt is required.',
    };
  }

  const plan = createMoviePlan(input);
  const continuity = createContinuityState(plan.characters);

  const scenes = plan.scenes.map((scene) =>
    applyContinuity(scene, continuity),
  );

  const voiceProfiles = plan.characters.map((character) =>
    createVoiceProfile(character),
  );

  const enrichedPlan: MoviePlan = {
    ...plan,
    scenes,
  };

  return {
    stage: 'timeline-bridge',
    status: 'ready',
    message:
      'Movie plan, character continuity, voice continuity and scene continuity prepared.',
    data: {
      movie: enrichedPlan,
      voiceProfiles,
      timeline: {
        tracks: [
          { type: 'video', scenes: scenes.map((scene) => scene.id) },
          { type: 'dialogue', scenes: scenes.map((scene) => scene.id) },
          { type: 'music', scenes: scenes.map((scene) => scene.id) },
          { type: 'sfx', scenes: scenes.map((scene) => scene.id) },
        ],
      },
      export: {
        status: 'ready-for-render',
        aspectRatio: enrichedPlan.aspectRatio,
      },
    },
  };
}
