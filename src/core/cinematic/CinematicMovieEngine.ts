import { prepareMoviePipeline } from '../../services/cinematic/runtime/MoviePipeline';

export class CinematicMovieEngine {
  create(input: {
    prompt: string;
    subject?: string;
    role?: string;
    durationSeconds?: number;
    aspectRatio?: string;
  }) {
    return prepareMoviePipeline(input);
  }
}

export const cinematicMovieEngine = new CinematicMovieEngine();
