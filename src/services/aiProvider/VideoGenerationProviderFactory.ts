import {
  VideoGenerationProvider,
  VideoGenerationRequest,
  VideoGenerationResult,
} from "./VideoGenerationProvider";

class UnconfiguredVideoProvider implements VideoGenerationProvider {
  async createVideo(
    _request: VideoGenerationRequest
  ): Promise<VideoGenerationResult> {
    return {
      success: false,
      provider: "unconfigured",
      error:
        "No video generation provider is configured. Configure a supported provider before starting video generation.",
    };
  }

  async getJobStatus(
    _jobId: string
  ): Promise<VideoGenerationResult & {
    status?: "queued" | "processing" | "completed" | "failed";
  }> {
    return {
      success: false,
      provider: "unconfigured",
      status: "failed",
      error: "No video generation provider is configured.",
    };
  }
}

export function getVideoGenerationProvider(
  providerName = "unconfigured"
): VideoGenerationProvider {
  const provider = providerName.toLowerCase();

  switch (provider) {
    default:
      return new UnconfiguredVideoProvider();
  }
}
