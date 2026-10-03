export interface CinematicRenderRequest {
  movieId: string;
  sceneId?: string;
  prompt: string;
  durationSeconds?: number;
  provider?: string;
}

export interface CinematicRenderResult {
  status: "queued" | "processing" | "completed" | "failed";
  provider: string;
  jobId?: string;
  outputUrl?: string;
  error?: string;
}
