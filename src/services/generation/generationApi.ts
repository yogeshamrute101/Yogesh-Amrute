export type GenerationKind =
  | "text-to-video"
  | "image-to-video"
  | "script-to-video"
  | "reel";

export interface GenerationJob {
  id: string;
  kind: GenerationKind;
  prompt: string;
  status: "queued" | "processing" | "completed" | "failed";
  createdAt: number;
  updatedAt: number;
  mediaUrl?: string;
  title?: string;
  durationSec?: number;
  error?: string;
}

interface GenerationResponse {
  success: boolean;
  data?: GenerationJob;
  error?: string;
}

const request = async (
  url: string,
  options?: RequestInit
): Promise<GenerationResponse> => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload?.success === false) {
    throw new Error(
      payload?.error || `Generation request failed (${response.status})`
    );
  }

  return payload;
};

export const createGenerationJob = async (
  kind: GenerationKind,
  prompt: string
): Promise<GenerationJob> => {
  const result = await request("/api/generation/jobs", {
    method: "POST",
    body: JSON.stringify({ kind, prompt }),
  });

  if (!result.data) {
    throw new Error("Generation job was not returned by the server.");
  }

  return result.data;
};

export const getGenerationJob = async (
  id: string
): Promise<GenerationJob> => {
  const result = await request(
    `/api/generation/jobs/${encodeURIComponent(id)}`
  );

  if (!result.data) {
    throw new Error("Generation job was not returned by the server.");
  }

  return result.data;
};

export const waitForGeneration = async (
  id: string,
  options: {
    intervalMs?: number;
    timeoutMs?: number;
    onUpdate?: (job: GenerationJob) => void;
  } = {}
): Promise<GenerationJob> => {
  const intervalMs = options.intervalMs ?? 1500;
  const timeoutMs = options.timeoutMs ?? 10 * 60 * 1000;
  const started = Date.now();

  while (Date.now() - started < timeoutMs) {
    const job = await getGenerationJob(id);
    options.onUpdate?.(job);

    if (job.status === "completed") {
      if (!job.mediaUrl) {
        throw new Error(
          "Generation completed but no media URL was returned."
        );
      }
      return job;
    }

    if (job.status === "failed") {
      throw new Error(job.error || "Video generation failed.");
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error("Video generation timed out.");
};
