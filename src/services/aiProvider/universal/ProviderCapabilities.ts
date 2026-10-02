export type AICapability =
  | 'text'
  | 'reasoning'
  | 'vision'
  | 'image'
  | 'video'
  | 'audio'
  | 'speechToText'
  | 'textToSpeech'
  | 'code'
  | 'structuredOutput';

export interface ProviderCapabilityProfile {
  provider: string;
  models: string[];
  capabilities: AICapability[];
  supportsStreaming?: boolean;
  supportsToolCalling?: boolean;
  supportsStructuredOutput?: boolean;
}

export interface AIRequestRequirements {
  capability: AICapability;
  model?: string;
  provider?: string;
}

export function supportsCapability(
  profile: ProviderCapabilityProfile,
  requirement: AIRequestRequirements,
): boolean {
  if (requirement.provider && profile.provider !== requirement.provider) {
    return false;
  }

  if (requirement.model && !profile.models.includes(requirement.model)) {
    return false;
  }

  return profile.capabilities.includes(requirement.capability);
}
