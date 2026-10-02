import {
  buildCinematicScene,
  validateCinematicPlan,
} from '../../core/cinematic/CinematicDirector';
import type { CinematicMoviePlan } from '../../types/CinematicMovie';

export interface CinematicRenderRequest {
  prompt: string;
  subject: CinematicMoviePlan['subject'];
  role: CinematicMoviePlan['role'];
  durationSeconds?: number;
  aspectRatio?: string;
  style?: string;
}

export interface CinematicExecutionResult {
  status: 'planned' | 'blocked';
  plan?: CinematicMoviePlan;
  errors?: string[];
}

export function prepareCinematicMovie(
  plan: CinematicMoviePlan,
): CinematicExecutionResult {
  const errors = validateCinematicPlan(plan);

  if (errors.length) {
    return { status: 'blocked', errors };
  }

  const scenes = plan.scenes.map((scene) =>
    buildCinematicScene(scene, plan.subject, plan.role),
  );

  return {
    status: 'planned',
    plan: {
      ...plan,
      scenes,
    },
  };
}
