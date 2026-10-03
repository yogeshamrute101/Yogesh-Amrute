import {
  analyzeReference,
} from "../../../core/referenceShow/ReferenceAnalyzer";
import {
  validateReferenceUrl,
} from "./ReferenceSafety";

export interface ReferenceLivePlan {
  sourceUrl: string;
  analysis: ReturnType<typeof analyzeReference>;
  originalProduction: true;
  sourceFootageReuseAllowed: false;
  unauthorizedVoiceCloneAllowed: false;
  unauthorizedLikenessCloneAllowed: false;
}

export class ReferenceLiveRuntime {
  analyze(url: string): ReferenceLivePlan {
    const parsed = validateReferenceUrl(url);
    const sourceUrl = parsed.toString();
    const analysis = analyzeReference(sourceUrl);

    return {
      sourceUrl,
      analysis,
      originalProduction: true,
      sourceFootageReuseAllowed: false,
      unauthorizedVoiceCloneAllowed: false,
      unauthorizedLikenessCloneAllowed: false,
    };
  }
}
