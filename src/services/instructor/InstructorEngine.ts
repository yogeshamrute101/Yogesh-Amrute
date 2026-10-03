import type {
  InstructorProfile,
} from "../../types/instructor/InstructorProfile";
import {
  validateInstructorProfile,
} from "../../types/instructor/InstructorProfile";

export interface InstructorRuntimePlan {
  profile: InstructorProfile;
  appearance: string;
  environment: string;
  voice: string;
  continuityKey: string;
}

export class InstructorEngine {
  createPlan(profile: InstructorProfile): InstructorRuntimePlan {
    validateInstructorProfile(profile);

    return {
      profile,
      appearance: `${profile.gender}:${profile.appearancePreset}`,
      environment: `${profile.subject}:${profile.environmentPreset}`,
      voice: profile.authorizedVoiceAsset
        ? `authorized:${profile.authorizedVoiceAsset}`
        : profile.voicePreset,
      continuityKey: [
        profile.gender,
        profile.role,
        profile.subject,
        profile.appearancePreset,
        profile.voicePreset,
      ].join("|"),
    };
  }

  canUseMimicry(profile: InstructorProfile): boolean {
    return Boolean(
      profile.authorizedVoiceAsset &&
      profile.authorizedLikenessAsset,
    );
  }
}
