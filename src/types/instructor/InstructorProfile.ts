export type InstructorGender = "male" | "female" | "neutral";
export type InstructorRole =
  | "teacher"
  | "host"
  | "reporter"
  | "presenter"
  | "narrator"
  | "interviewer";

export interface InstructorProfile {
  gender: InstructorGender;
  role: InstructorRole;
  subject: string;
  appearancePreset: string;
  environmentPreset: string;
  voicePreset: string;
  authorizedVoiceAsset?: string;
  authorizedLikenessAsset?: string;
}

export function validateInstructorProfile(
  profile: InstructorProfile,
): void {
  if (!profile.subject.trim()) {
    throw new Error("Instructor subject is required.");
  }

  if (!profile.appearancePreset.trim()) {
    throw new Error("Instructor appearance preset is required.");
  }

  if (!profile.voicePreset.trim()) {
    throw new Error("Instructor voice preset is required.");
  }

  if (
    profile.authorizedVoiceAsset === undefined &&
    profile.voicePreset.toLowerCase().includes("clone")
  ) {
    throw new Error("Voice cloning requires an authorized voice asset.");
  }
}
