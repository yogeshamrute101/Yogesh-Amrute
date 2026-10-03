import {
  TrendingVideoEngine,
} from "./TrendingVideoEngine";
import type {
  GeneratedTrendingVideoRequest,
} from "../../types/trending/TrendingContent";

export class TrendingRuntime {
  private readonly engine = new TrendingVideoEngine();

  createOriginalPlan(
    request: GeneratedTrendingVideoRequest,
  ) {
    return this.engine.createPlan(request);
  }
}
