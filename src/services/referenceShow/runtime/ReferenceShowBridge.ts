import {
  ReferenceLiveRuntime,
} from "./ReferenceLiveRuntime";

export interface OriginalLiveShowPlan {
  sourceUrl: string;
  original: true;
  sourceFootageReuseAllowed: false;
  unauthorizedVoiceCloneAllowed: false;
  unauthorizedLikenessCloneAllowed: false;
  analysis: unknown;
}

export class ReferenceShowBridge {
  private readonly runtime = new ReferenceLiveRuntime();

  create(url: string): OriginalLiveShowPlan {
    const result = this.runtime.analyze(url);

    return {
      sourceUrl: result.sourceUrl,
      original: true,
      sourceFootageReuseAllowed: false,
      unauthorizedVoiceCloneAllowed: false,
      unauthorizedLikenessCloneAllowed: false,
      analysis: result.analysis,
    };
  }
}
