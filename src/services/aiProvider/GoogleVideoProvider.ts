import { GoogleGenAI } from "@google/genai";
import {
  VideoGenerationProvider,
  VideoGenerationRequest,
  VideoGenerationResult,
} from "./VideoGenerationProvider";

export class GoogleVideoProvider implements VideoGenerationProvider {
  private readonly ai: GoogleGenAI;

  constructor(apiKey = process.env.GEMINI_API_KEY) {
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    this.ai = new GoogleGenAI({ apiKey });
  }

  async createVideo(
    request: VideoGenerationRequest
  ): Promise<VideoGenerationResult> {
    try {
      const operation = await this.ai.models.generateVideos({
        model: "veo-3.1-generate-preview",
        prompt: request.prompt,
        config: {
          numberOfVideos: 1,
          durationSeconds: request.durationSec ?? 8,
          aspectRatio: request.aspectRatio ?? "9:16",
        },
      });

      const jobId = operation.name;

      if (!jobId) {
        return {
          success: false,
          provider: "google-veo",
          error: "Google returned no video operation ID.",
        };
      }

      return {
        success: true,
        provider: "google-veo",
        jobId,
        providerJobId: jobId,
      };
    } catch (error) {
      return {
        success: false,
        provider: "google-veo",
        error:
          error instanceof Error
            ? error.message
            : "Google video generation request failed.",
      };
    }
  }

  async getJobStatus(
    jobId: string
  ): Promise<
    VideoGenerationResult & {
      status?: "queued" | "processing" | "completed" | "failed";
    }
  > {
    try {
      const operation = await this.ai.operations.getVideosOperation({
        operation: jobId as any,
      });

      if (!operation) {
        return {
          success: false,
          provider: "google-veo",
          status: "failed",
          error: "Google video operation was not returned.",
        };
      }

      if (operation.error) {
        return {
          success: false,
          provider: "google-veo",
          status: "failed",
          error:
            typeof operation.error.message === "string"
              ? operation.error.message
              : "Google video generation failed.",
        };
      }

      if (!operation.done) {
        return {
          success: true,
          provider: "google-veo",
          jobId,
          providerJobId: jobId,
          status: "processing",
        };
      }

      const video = operation.response?.generatedVideos?.[0]?.video;

      if (!video) {
        return {
          success: false,
          provider: "google-veo",
          status: "failed",
          error: "Google completed the operation but returned no video.",
        };
      }

      const videoUrl = video.uri;

      if (!videoUrl) {
        return {
          success: false,
          provider: "google-veo",
          status: "failed",
          error: "Google returned no video URI.",
        };
      }

      return {
        success: true,
        provider: "google-veo",
        jobId,
        providerJobId: jobId,
        status: "completed",
        videoUrl,
      };
    } catch (error) {
      return {
        success: false,
        provider: "google-veo",
        status: "failed",
        error:
          error instanceof Error
            ? error.message
            : "Unable to read Google video operation.",
      };
    }
  }
}
