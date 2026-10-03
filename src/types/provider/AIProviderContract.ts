export type AIProviderCapability =
  | "text"
  | "image"
  | "video"
  | "audio"
  | "speech-to-text"
  | "image-to-video"
  | "text-to-video";

export interface AIProviderStatus {
  configured: boolean;
  healthy: boolean;
  reason?: string;
}

export interface AIProviderContract {
  readonly id: string;
  readonly name: string;
  capabilities(): readonly AIProviderCapability[];
  status(): AIProviderStatus;
}

export class UnconfiguredAIProvider implements AIProviderContract {
  constructor(
    public readonly id: string,
    public readonly name: string,
  ) {}

  capabilities(): readonly AIProviderCapability[] {
    return [];
  }

  status(): AIProviderStatus {
    return {
      configured: false,
      healthy: false,
      reason: "Provider credentials or endpoint are not configured.",
    };
  }
}
