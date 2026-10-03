export interface ReferenceSafetyPolicy {
  originalProduction: true;
  noExactCopyrightedFootage: true;
  noUnauthorizedVoiceClone: true;
  noUnauthorizedLikenessClone: true;
}

export const REFERENCE_SAFETY_POLICY: ReferenceSafetyPolicy = {
  originalProduction: true,
  noExactCopyrightedFootage: true,
  noUnauthorizedVoiceClone: true,
  noUnauthorizedLikenessClone: true,
};

export function validateReferenceUrl(url: string): URL {
  const parsed = new URL(url);

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Only HTTP(S) reference URLs are supported.");
  }

  return parsed;
}
