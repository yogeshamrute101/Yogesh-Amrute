export interface VideoProviderConfig {
  providerUrl?: string;
  apiKey?: string;
}

export function getVideoProviderConfig(): VideoProviderConfig {
  return {
    providerUrl: process.env.VIDEO_GENERATION_PROVIDER_URL,
    apiKey: process.env.VIDEO_GENERATION_API_KEY,
  };
}

export function isVideoProviderConfigured(): boolean {
  const config = getVideoProviderConfig();

  return Boolean(
    config.providerUrl &&
    config.apiKey
  );
}
