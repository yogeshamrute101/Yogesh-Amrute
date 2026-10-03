import type {
  GeneratedTrendingVideoRequest,
  TrendingTopic,
} from "../../types/trending/TrendingContent";

export interface TrendingVideoPlan {
  topic: TrendingTopic;
  originalScriptRequired: true;
  sourceFootageReuseAllowed: false;
  generationPrompt: string;
}

export class TrendingVideoEngine {
  createPlan(
    request: GeneratedTrendingVideoRequest,
  ): TrendingVideoPlan {
    if (!request.topic.title.trim()) {
      throw new Error("Trending topic title is required.");
    }

    return {
      topic: request.topic,
      originalScriptRequired: true,
      sourceFootageReuseAllowed: false,
      generationPrompt:
        `Create an original video about: ${request.topic.title}. ` +
        `Use source information only as factual context. ` +
        `Do not reproduce source footage, branding, or protected presentation.`,
    };
  }
}
