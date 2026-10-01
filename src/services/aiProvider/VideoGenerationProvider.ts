export type VideoGenerationRequest = {
  prompt: string;
  durationSec?: number;
  aspectRatio?: string;
  referenceImages?: string[];
  referenceVideos?: string[];
};

export type VideoGenerationResult = {
  success: boolean;
  jobId?: string;
  videoUrl?: string;
  providerJobId?: string;
  error?: string;
  provider?: string;
};

export interface VideoGenerationProvider {
  createVideo(
    request: VideoGenerationRequest
  ): Promise<VideoGenerationResult>;

  getJobStatus(
    jobId: string
  ): Promise<VideoGenerationResult & {
    status?: 'queued' | 'processing' | 'completed' | 'failed';
  }>;
}
