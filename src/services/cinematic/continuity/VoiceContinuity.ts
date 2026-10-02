import type { MovieCharacter } from '../../../types/CinematicPipeline';

export interface VoiceProfile {
  characterId: string;
  voiceId?: string;
  description: string;
  language: string;
  speakingStyle: string;
  pitchDirection: string;
}

export function createVoiceProfile(
  character: MovieCharacter,
  language = 'auto',
): VoiceProfile {
  return {
    characterId: character.id,
    voiceId: character.voiceId,
    description: character.voiceDescription,
    language,
    speakingStyle: character.role === 'anchor'
      ? 'professional broadcast delivery'
      : 'natural conversational cinematic delivery',
    pitchDirection: 'consistent across all scenes',
  };
}
